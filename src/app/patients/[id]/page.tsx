"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Patient } from "@/types/therapist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Mail, 
  Phone, 
  Briefcase, 
  Church, 
  Heart, 
  ArrowLeft,
  Clock,
  User,
  Settings,
  Activity
} from "lucide-react";
import { usePatients } from "@/hooks/use-patients";
import { useQuery } from "@tanstack/react-query";
import { PatientOverview } from "@/components/patient/patient-overview";
import { SessionsTab } from "@/components/patient/sessions-tab";
import { PatientNotes } from "@/components/patient/patient-notes";

export default function PatientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { fetchPatientById } = usePatients();
  const [patient, setPatient] = useState<Patient | null>(null);

  const { data: fetchedPatient, isLoading, error } = useQuery({
    queryKey: ['patient', params.id],
    queryFn: () => fetchPatientById(params.id as string),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (fetchedPatient) {
      setPatient(fetchedPatient);
    }
  }, [fetchedPatient]);

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
    <div className="flex flex-col min-h-screen bg-muted/5">
      {/* Top Navigation */}
      <div className="border-b bg-white">
        <div className="container max-w-6xl mx-auto flex items-center gap-4 py-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/patients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Patient Profile</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="grid gap-8">
          {/* Profile Header */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Basic Info Card */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={patient.avatar || `/placeholder.svg?height=96&width=96`} />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <h2 className="text-2xl font-bold">{patient.name}</h2>
                    <p className="text-muted-foreground">
                      {patient.age} years • {patient.gender}
                    </p>
                    {patient.occupation && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {patient.occupation}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Preferred Days</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {patient.preferredDays.days.join(", ")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Therapist</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {patient.assignedTherapist?.name || "Not assigned"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <PatientOverview patient={patient} />
        </TabsContent>
        <TabsContent value="sessions">
          <SessionsTab patientId={params.id as string} />
        </TabsContent>
        
      </Tabs>
        </div>
      </div>
    </div>
  );
} 