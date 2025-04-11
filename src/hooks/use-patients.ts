import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Patient } from '@/types/therapist'

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function fetchPatients(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Patient>> {
  const response = await fetch(`/api/patients?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch patients')
  }
  return response.json()
}

async function fetchPatientById(id: string): Promise<Patient> {
  const response = await fetch(`/api/patients/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch patient')
  }
  return response.json()
}

async function uploadPatients(data: any[]): Promise<{ patients: Patient[] }> {
  const response = await fetch('/api/transform-patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })

  if (!response.ok) {
    throw new Error('Failed to process data')
  }

  return response.json()
}

export function usePatients(page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<PaginatedResponse<Patient>>({
    queryKey: ['patients', page, limit],
    queryFn: () => fetchPatients(page, limit),
  })

  const uploadMutation = useMutation({
    mutationFn: uploadPatients,
    onSuccess: () => {
      // Invalidate and refetch patients query
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  return {
    patients: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    uploadPatients: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    fetchPatientById,
  }
} 