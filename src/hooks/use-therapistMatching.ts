import { useState } from 'react';

export function useTherapistMatching() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assignTherapist = async (patientId: number, therapistId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId,
          therapistId,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign therapist");
      }

      const session = await response.json();
      return session;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to assign therapist"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const approveMatch = async (patientId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${patientId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "active",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve match");
      }

      const session = await response.json();
      return session;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to approve match"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignTherapist,
    approveMatch,
    isLoading,
    error,
  };
} 