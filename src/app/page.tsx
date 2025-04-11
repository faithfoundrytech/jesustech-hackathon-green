"use client";

import { useState, useMemo } from "react";

import { MatchDetails } from "@/components/therapist-matching/MatchDetails";
import { DocumentUpload } from "@/components/therapist-matching/DocumentUpload";
import { LoadingState } from "@/components/therapist-matching/LoadingState";
import { useTherapistMatching } from "@/hooks/use-therapistMatching";
import { Therapist, Patient } from "@/types/therapist";
import { DashboardOverview } from "@/components/therapist-matching/DashboardOverview";
import { DashboardHeader } from "@/components/therapist-matching/DashboardHeader";

// Sample data for therapists
const initialTherapists: Therapist[] = [
  {
    "id": 1,
    "name": "Diana Machuki",
    "age": 25,
    "maritalStatus": "Single",
    "gender": "Female",
    "specialty": "Young Adult Counseling",
    "availability": {
      "days": ["Monday", "Tuesday", "Thursday"],
      "timeSlots": [
        { "start": "10:00", "end": "16:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "5 years"
  },
  {
    "id": 2,
    "name": "Irene Mwangi",
    "age": 41,
    "maritalStatus": "Widowed",
    "gender": "Female",
    "specialty": "Teen Counseling",
    "availability": {
      "days": ["Wednesday", "Friday"],
      "timeSlots": [
        { "start": "09:00", "end": "15:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "12 years"
  },
  {
    "id": 3,
    "name": "Maggie Ndegwa",
    "age": 53,
    "maritalStatus": "Widowed",
    "gender": "Female",
    "specialty": "Teen Mental Health",
    "availability": {
      "days": ["Monday", "Thursday"],
      "timeSlots": [
        { "start": "08:00", "end": "14:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "15 years"
  },
  {
    "id": 4,
    "name": "Agnes Makumi",
    "age": 38,
    "maritalStatus": "Divorced",
    "gender": "Female",
    "specialty": "Teen Support",
    "availability": {
      "days": ["Tuesday", "Saturday"],
      "timeSlots": [
        { "start": "11:00", "end": "17:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "10 years"
  },
  {
    "id": 5,
    "name": "Agnes Nganga",
    "age": 32,
    "maritalStatus": "Married",
    "gender": "Female",
    "specialty": "Teen Therapy",
    "availability": {
      "days": ["Wednesday", "Sunday"],
      "timeSlots": [
        { "start": "10:00", "end": "14:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "8 years"
  },
  {
    "id": 6,
    "name": "Brenda Wanjiru",
    "age": 41,
    "maritalStatus": "Married",
    "gender": "Female",
    "specialty": "Middle-aged Counseling",
    "availability": {
      "days": ["Friday", "Saturday"],
      "timeSlots": [
        { "start": "09:00", "end": "13:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "9 years"
  },
  {
    "id": 7,
    "name": "Brian Omondi",
    "age": 58,
    "maritalStatus": "Married",
    "gender": "Male",
    "specialty": "Child Therapy",
    "availability": {
      "days": ["Monday", "Wednesday"],
      "timeSlots": [
        { "start": "08:00", "end": "12:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "20 years"
  },
  {
    "id": 8,
    "name": "Christine Kimaru",
    "age": 52,
    "maritalStatus": "Married",
    "gender": "Female",
    "specialty": "Elderly Mental Health",
    "availability": {
      "days": ["Tuesday", "Thursday"],
      "timeSlots": [
        { "start": "10:00", "end": "15:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "18 years"
  },
  {
    "id": 9,
    "name": "Emily Njeri",
    "age": 45,
    "maritalStatus": "Married",
    "gender": "Female",
    "specialty": "Young Adult Therapy",
    "availability": {
      "days": ["Friday", "Sunday"],
      "timeSlots": [
        { "start": "12:00", "end": "18:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "7 years"
  },
  {
    "id": 10,
    "name": "Erick Kimani",
    "age": 29,
    "maritalStatus": "Married",
    "gender": "Male",
    "specialty": "Elderly Support",
    "availability": {
      "days": ["Monday", "Saturday"],
      "timeSlots": [
        { "start": "09:00", "end": "13:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "6 years"
  },
  {
    "id": 11,
    "name": "Esther Mwaniki",
    "age": 52,
    "maritalStatus": "Widowed",
    "gender": "Female",
    "specialty": "Young Adults Counseling",
    "availability": {
      "days": ["Monday", "Tuesday", "Thursday"],
      "timeSlots": [
        { "start": "09:00", "end": "13:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "10 years"
  },
  {
    "id": 12,
    "name": "Fiona Nduta",
    "age": 30,
    "maritalStatus": "Single",
    "gender": "Female",
    "specialty": "Children Therapy",
    "availability": {
      "days": ["Monday", "Saturday"],
      "timeSlots": [
        { "start": "09:00", "end": "13:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "6 years"
  },
  {
    "id": 13,
    "name": "Fredrick Mungai",
    "age": 57,
    "maritalStatus": "Widowed",
    "gender": "Male",
    "specialty": "Child Therapy",
    "availability": {
      "days": ["Monday", "Wednesday", "Friday"],
      "timeSlots": [
        { "start": "09:00", "end": "13:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "15 years"
  },
  {
    "id": 14,
    "name": "Freida Angaine",
    "age": 29,
    "maritalStatus": "Married",
    "gender": "Female",
    "specialty": "Teen Counseling",
    "availability": {
      "days": ["Monday", "Tuesday", "Thursday"],
      "timeSlots": [
        { "start": "09:00", "end": "13:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "6 years"
  },
  {
    "id": 15,
    "name": "Gladwel Imbaali",
    "age": 52,
    "maritalStatus": "Divorced",
    "gender": "Female",
    "specialty": "Middle-aged Counseling",
    "availability": {
      "days": ["Monday", "Tuesday", "Thursday"],
      "timeSlots": [
        { "start": "09:00", "end": "13:00" }
      ]
    },
    "patients": 0,
    "avatar": "/placeholder.svg?height=40&width=40",
    "rating": 0,
    "experience": "10 years"
  }
];

export default function DashboardAlt() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading] = useState(false);
  const [localPatients] = useState<Patient[]>([]);
  const [searchTherapist, setSearchTherapist] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const {
    therapists: matchedTherapists,
    patients: matchedPatients,
    isAutoMatching,
    autoMatchPatients,
    approveMatch,               
    setPatients,
    setTherapists,
  } = useTherapistMatching(
    localPatients,
    initialTherapists
  );

  // Handle file upload completion
  const handleUploadComplete = (patients: Patient[]) => {
    setPatients(patients);
    if (patients.length > 0) {
      setIsUploaded(true);
    } else {
      setIsUploaded(false);
      setPatients([]);
    }
  };

  const handleAutoMatch = async () => {
    await autoMatchPatients();
  };

  const matchesCount = useMemo(() => 
    matchedPatients.filter((p) => p.assignedTherapistId).length,
    [matchedPatients]
  );

  const handleAssignTherapist = (patientId: number, therapistId: number) => {
    // Get the current patient to find their old therapist
    const currentPatient = matchedPatients.find(p => p.id === patientId);
    const oldTherapistId = currentPatient?.assignedTherapistId;

    // Update patients state
    const updatedPatients = matchedPatients.map((p) =>
      p.id === patientId
        ? { ...p, assignedTherapistId: therapistId }
        : p
    );
    setPatients(updatedPatients);

    // Update therapists state
    const updatedTherapists = matchedTherapists.map((t) => {
      // Decrease count for old therapist if exists
      if (oldTherapistId && t.id === oldTherapistId) {
        return { ...t, patients: Math.max(0, t.patients - 1) };
      }
      // Increase count for new therapist
      if (t.id === therapistId) {
        return { ...t, patients: t.patients + 1 };
      }
      return t;
    });
    setTherapists(updatedTherapists);
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <DashboardHeader
        isUploaded={isUploaded}
        isLoading={isLoading}
        isAutoMatching={isAutoMatching}
        onAutoMatch={handleAutoMatch}
      />

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        {/* Dashboard Overview */}
        <DashboardOverview
          therapistsCount={matchedTherapists.length}
          patientsCount={matchedPatients.length}
          matchProgress={matchedPatients.length ? (matchesCount / matchedPatients.length) * 100 : 0}
          patientsPendingMatchesCount={matchedPatients.length - matchesCount}
        />

        {/* Document Upload Section */}
        {!isUploaded && !isLoading && (
          <DocumentUpload
            onUploadComplete={handleUploadComplete}
          />
        )}

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Therapist and Patient Matching Section */}
        {isUploaded && !isLoading && matchedPatients.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            <MatchDetails
              selectedPatient={
                matchedPatients.find((p) => p.id === selectedPatientId) ||
                null
              }
              therapists={matchedTherapists}
              onApproveMatch={approveMatch}
              onAssignTherapist={handleAssignTherapist}
            />
          </div>
        )}
      </main>
    </div>
  );
}
