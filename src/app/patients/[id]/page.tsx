"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Patient } from "@/types/therapist";
import { usePatients } from "@/hooks/use-patients";
import PatientDashboard from "@/components/patient/patient-dashboard";

export default function PatientProfilePage() {
  const params = useParams();
  const { fetchPatientById } = usePatients();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPatient = async () => {
      try {
        if (params.id) {
          const fetchedPatient = await fetchPatientById(params.id as string);
          setPatient(fetchedPatient);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatient();
  }, [params.id, fetchPatientById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-muted-foreground">Patient not found</div>
      </div>
    );
  }

  return (
    <PatientDashboard patient={patient} />
  );
} 