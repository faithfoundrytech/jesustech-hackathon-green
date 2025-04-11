import { ChatDeepSeek } from "@langchain/deepseek";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Patient } from "@/types/therapist.js";
import "../../envConfig";

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const CHUNK_SIZE = 10;

interface PIIData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  occupation?: string;
  church?: string;
  marriageDuration?: string;
}

const model = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY, 
  model: "deepseek-chat",
});

const findColumnByPatterns = (data: any, patterns: string[]): string | undefined => {
  const keys = Object.keys(data);
  return keys.find(key => 
    patterns.some(pattern => 
      key.toLowerCase().includes(pattern.toLowerCase())
    )
  );
};

const extractPII = (data: any, id: number): PIIData => {
  const nameColumn = findColumnByPatterns(data, ['name', 'full name', 'fullnames']);
  const emailColumn = findColumnByPatterns(data, ['email', 'email address']);
  const phoneColumn = findColumnByPatterns(data, ['phone', 'phone number', 'contact']);
  const occupationColumn = findColumnByPatterns(data, ['occupation', 'work', 'job']);
  const churchColumn = findColumnByPatterns(data, ['church', 'place of worship']);
  const marriageDurationColumn = findColumnByPatterns(data, ['marriage duration', 'married for', 'years married']);

  return {
    id,
    name: nameColumn ? data[nameColumn]?.trim() || '' : '',
    email: emailColumn ? data[emailColumn]?.trim() : undefined,
    phone: phoneColumn ? data[phoneColumn]?.trim() : undefined,
    occupation: occupationColumn ? data[occupationColumn]?.trim() : undefined,
    church: churchColumn ? data[churchColumn]?.trim() : undefined,
    marriageDuration: marriageDurationColumn ? data[marriageDurationColumn]?.trim() : undefined,
  };
};

const removePII = (data: any): any => {
  const piiPatterns = [
    'id', 'patient id', 'patient number',
    'name', 'full name', 'fullnames',
    'email', 'email address',
    'phone', 'phone number', 'contact',
    'occupation', 'work', 'job',
    'church', 'place of worship',
    'marriage duration', 'married for', 'years married'
  ];

  const sanitizedData = { ...data };
  Object.keys(sanitizedData).forEach(key => {
    if (piiPatterns.some(pattern => key.toLowerCase().includes(pattern.toLowerCase()))) {
      delete sanitizedData[key];
    }
  });

  return sanitizedData;
};

const restorePII = (data: any, piiMap: Map<number, PIIData>): any => {
  const pii = piiMap.get(data.id);
  if (!pii) return data;
  
  // Create a new object with the processed data and restore PII in standard format
  return {
    ...data,
    name: pii.name,
    email: pii.email,
    phone: pii.phone,
    occupation: pii.occupation,
    church: pii.church,
    marriageDuration: pii.marriageDuration,
  };
};

const processChunk = async (chunk: any[]): Promise<Patient[]> => {
  const piiMap = new Map<number, PIIData>();
  chunk.forEach((data, index) => {
    const tempId = index + 1;
    piiMap.set(tempId, extractPII(data, tempId));
  });
  
  const sanitizedData = chunk.map(removePII);

  const messages = [
    new SystemMessage(`You are an expert data extraction system. Your task is to analyze Excel data and extract patient information into a structured format.
The output should be a JSON array of patient objects with the following structure:
{
  "id": number,  // This should be the temporary ID (1-based index)
  "age": number,
  "gender": string,
  "concerns": string,
  "preferredDays": {
    "days": string[],
    "timeSlots": { "start": string, "end": string }[]
  },
  "assignedTherapist": null,
  "matchScore": 0,
  "matchReason": ""
}

Rules:
1. Extract age from any column that might contain it (e.g., "age", "years", "date of birth")
2. Extract gender from any column that might contain it (e.g., "gender", "sex", "male/female")
3. Extract concerns from any column that might contain patient issues or problems (e.g., "counselling need", "concerns", "issues")
4. Extract preferred days and time slots from any columns that might contain scheduling information (e.g., "counselling day", "availability", "preferred time")
5. Handle missing or malformed data gracefully
6. Ensure all required fields are present in the output
7. Return only valid JSON that matches the required structure
8. Use the temporary ID (1-based index) for each record
9. For time slots, extract the time range from the text (e.g., "9:00am - 4:00pm" should be split into appropriate slots)`),
    new HumanMessage(`Here is the Excel data chunk to process:
${JSON.stringify(sanitizedData, null, 2)}

Please extract and structure this data into patient objects. Return only the JSON array, no additional text.`),
  ];

  const response = await model.invoke(messages);
  const content = response.content as string;
  const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
  const processedData = JSON.parse(jsonStr) as Patient[];

  // Restore PII data using temporary ID mapping
  return processedData.map(patient => restorePII(patient, piiMap));
};

export const transformExcelToPatientsWithLLM = async (
  excelData: any[]
): Promise<Patient[]> => {
  try {
    const chunks = [];
    for (let i = 0; i < excelData.length; i += CHUNK_SIZE) {
      chunks.push(excelData.slice(i, i + CHUNK_SIZE));
    }

    const processedChunks = await Promise.all(
      chunks.map(async (chunk, chunkIndex) => {
        const patients = await processChunk(chunk);
        return patients.map((patient, index) => ({
          ...patient,
          id: chunkIndex * CHUNK_SIZE + index + 1,
        }));
      })
    );

    const allPatients = processedChunks.flat();
    return allPatients.map((patient) => ({
      id: patient.id,
      name: patient.name || `Patient ${patient.id}`,
      age: patient.age || 0,
      gender: patient.gender || 'Not Specified',
      email: patient.email,
      phone: patient.phone,
      occupation: patient.occupation,
      church: patient.church,
      marriageDuration: patient.marriageDuration,
      concerns: patient.concerns || "No specific concerns",
      preferredDays: {
        days: Array.isArray(patient.preferredDays?.days)
          ? patient.preferredDays.days
          : [],
        timeSlots: Array.isArray(patient.preferredDays?.timeSlots)
          ? patient.preferredDays.timeSlots.filter(
              (slot) => slot.start && slot.end
            )
          : [],
      },
      assignedTherapistId: null,
      assignedTherapist: null,
      matchScore: 0,
      matchReason: "",
    }));
  } catch (error) {
    console.error("Error transforming Excel data with LLM:", error);
    throw new Error("Failed to process Excel data with AI");
  }
};
