import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Therapist } from '@/types/therapist';
import { createTherapist, getTherapists, updateTherapist } from '@/lib/api/therapists';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function fetchTherapistById(id: string): Promise<Therapist> {
  const response = await fetch(`/api/therapists/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch therapist');
  }
  return response.json();
}

export function useTherapists(params?: { page?: number, limit?: number, therapistId?: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<Therapist>>({
    queryKey: ['therapists', params?.page, params?.limit],
    queryFn: () => getTherapists(params?.page, params?.limit),
    refetchOnWindowFocus: false,
  });

  const { data: therapist, isLoading: isLoadingTherapist, error: therapistError } = useQuery<Therapist>({
    queryKey: ['therapist', params?.therapistId],
    queryFn: () => fetchTherapistById(params?.therapistId),
    enabled: !!params?.therapistId,
  });

  const createTherapistMutation = useMutation<Therapist, Error, Omit<Therapist, "id" | "patients" | "rating" | "avatar">>({
    mutationFn: createTherapist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
    },
  });

  const updateTherapistMutation = useMutation<Therapist, Error, { id: string; data: Partial<Therapist> }>({
    mutationFn: ({ id, data }) => updateTherapist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
      queryClient.invalidateQueries({ queryKey: ['therapist'] });
    },
  });

  return {
    therapists: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createTherapist: createTherapistMutation.mutateAsync,
    updateTherapist: updateTherapistMutation.mutateAsync,
    refetch,
    isCreating: createTherapistMutation.isPending,
    isUpdating: updateTherapistMutation.isPending,
    createError: createTherapistMutation.error,
    updateError: updateTherapistMutation.error,
    therapist,
    isLoadingTherapist,
    therapistError,
  };
}