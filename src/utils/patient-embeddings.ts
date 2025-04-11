import { ContentEmbedding, GoogleGenAI } from "@google/genai";
import { Patient } from "@/types/therapist";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const createPatientText = (patient: Patient): string => {
  return `
    Patient Information:
    Age: ${patient.age}
    Gender: ${patient.gender}
    Occupation: ${patient.occupation || "Not specified"}
    Church: ${patient.church || "Not specified"}
    Marriage Duration: ${patient.marriageDuration || "Not specified"}
    Concerns: ${patient.concerns}
    Preferred Days: ${patient.preferredDays.days.join(", ")}
    Time Slots: ${patient.preferredDays.timeSlots
      .map((slot) => `${slot.start}-${slot.end}`)
      .join(", ")}
  `.trim();
};

// Simple delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateEmbeddingsFromText = async (
  text: string
): Promise<number[]> => {
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });
    return response.embeddings?.[0]?.values || [];
  } catch (error) {
    console.error("Error generating embedding for text:", error);
    throw new Error("Failed to generate embedding for text");
  }
};

export const generatePatientEmbedding = async (
  patient: Patient
): Promise<number[]> => {
  try {
    const embedding = await generateEmbeddingsFromText(
      createPatientText(patient)
    );
    return embedding;
  } catch (error) {
    console.error("Error generating embedding for patient:", error);
    throw new Error("Failed to generate patient embedding");
  }
};

export const generatePatientEmbeddings = async (
  patients: Patient[]
): Promise<Map<string, number[]>> => {
  const embeddings = new Map<string, number[]>();

  // Process patients with a delay between each request
  for (const patient of patients) {
    if (patient._id) {
      const embedding = await generatePatientEmbedding(patient);
      embeddings.set(patient._id, embedding);
      // Wait 50ms between requests to stay well under the rate limit
      await delay(50);
    }
  }

  return embeddings;
};
