import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Session {
  _id: string;
  start: string;
  end: string;
  therapistName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  patientId: string;
  patientName: string;
}

export function useSessions(patientId: string) {
  const queryOptions: UseQueryOptions<Session[], Error> = {
    queryKey: ['sessions', patientId],
    queryFn: async () => {
      const response = await fetch(`/api/sessions?patientId=${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return response.json() as Promise<Session[]>;
    },
  };

  const query = useQuery(queryOptions);

  if (query.isError) {
    console.error('Error fetching sessions:', query.error);
    toast.error("Failed to load sessions");
  }

  return query;
}

export function useTherapistSessions(therapistId: string) {
  const queryOptions: UseQueryOptions<Session[], Error> = {
    queryKey: ['therapist-sessions', therapistId],
    queryFn: async () => {
      const response = await fetch(`/api/sessions?therapistId=${therapistId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return response.json() as Promise<Session[]>;
    },
  };

  const query = useQuery(queryOptions);

  if (query.isError) {
    console.error('Error fetching therapist sessions:', query.error);
    toast.error("Failed to load sessions");
  }

  return query;
} 