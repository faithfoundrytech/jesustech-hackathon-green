import { GoogleGenAI } from "@google/genai";
import { Therapist } from "@/types/therapist";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const createTherapistText = (therapist: Therapist): string => {
  return `
    Professional Profile:
    Age: ${therapist.age}
    Gender: ${therapist.gender}
    Marital Status: ${therapist.maritalStatus}
    Specialty: ${therapist.specialty}
    Experience Level: ${therapist.experience}
    Education Background: ${therapist.education}
    Languages: ${therapist.languages.join(", ")}
    Professional Bio: ${therapist.bio}
  `.trim();
};

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

export const generateTherapistEmbedding = async (
  therapist: Therapist
): Promise<number[]> => {
  try {
    const embedding = await generateEmbeddingsFromText(
      createTherapistText(therapist)
    );
    return embedding;
  } catch (error) {
    console.error("Error generating embedding for therapist:", error);
    throw new Error("Failed to generate therapist embedding");
  }
};

export const generateTherapistEmbeddings = async (
  therapists: Therapist[]
): Promise<Map<string, number[]>> => {
  const embeddings = new Map<string, number[]>();

  // Process therapists with a delay between each request
  for (const therapist of therapists) {
    if (therapist._id) {
      const embedding = await generateTherapistEmbedding(therapist);
      embeddings.set(therapist._id.toString(), embedding);
      // Wait 50ms between requests to stay well under the rate limit
      await delay(50);
    }
  }

  return embeddings;
}; 