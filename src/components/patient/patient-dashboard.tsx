import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import { PatientOverview } from "@/components/patient/patient-overview";
import { SessionsTab } from "@/components/patient/sessions-tab";
import { Patient } from "@/types/therapist";
import BasicInfoCard from "@/components/patient/basic-info-card";

const PatientDashboard = ({ patient }: { patient: Patient }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-muted/5">
      {/* Top Navigation */}
      <div className="border-b bg-white">
        <div className="container max-w-6xl mx-auto flex items-center gap-4 py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/patients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Patient Profile</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="grid gap-8">
          <BasicInfoCard
            avatar={patient.avatar}
            name={patient.name}
            age={patient.age}
            gender={patient.gender}
            occupation={patient.occupation}
            assignedTherapist={patient?.assignedTherapist?.name}
            preferredDays={patient.preferredDays.days}
          />

          {/* Main Content */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <PatientOverview
                email={patient.email} 
                phone={patient.phone}
                maritalStatus={patient?.maritalStatus}
                church={patient?.church}
                occupation={patient.occupation}
                timeSlots={patient.preferredDays.timeSlots}
                assignedTherapist={patient?.assignedTherapist}
              />
            </TabsContent>
            <TabsContent value="sessions">
              <SessionsTab patientId={patient._id as string} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
