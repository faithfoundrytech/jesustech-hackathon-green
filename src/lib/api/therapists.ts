import { Therapist } from "@/types/therapist";

export async function createTherapist(data: Omit<Therapist, "id" | "patients" | "rating" | "avatar">) {
  const response = await fetch('/api/therapists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create therapist');
  }

  return response.json();
}

export async function getTherapists(page: number = 1, limit: number = 10) {
  const response = await fetch(`/api/therapists?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch therapists');
  }

  return response.json();
}

export async function updateTherapist(id: string, data: Partial<Therapist>) {
  const response = await fetch(`/api/therapists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update therapist');
  }

  return response.json();
} 