"use client";

import { useParams } from "next/navigation";
import { useTherapists } from "@/hooks/use-therapists";
import TherapistDashboard from "@/components/therapist/therapist-dashboard";

export default function TherapistProfilePage() {
  const params = useParams();
  const { therapist, isLoading, error } = useTherapists({ therapistId: params.id as string });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-muted-foreground">Therapist not found</div>
      </div>
    );
  }

  return (
    <TherapistDashboard therapist={therapist} />
  );
} 