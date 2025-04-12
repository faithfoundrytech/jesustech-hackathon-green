import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowLeft,
  Settings,
  Activity,
} from "lucide-react";
import { EditTherapistModal } from "@/components/therapist/edit-therapist-modal";
import { NewSessionModal } from "@/components/therapist/new-session-modal";
import { Therapist } from "@/types/therapist";
import TherapistOverview from "./therapist-overview";

import TherapistBasicInfo from "./therapist-basic-info";
import TherapistSessions from "./therapist-sessions";
const TherapistDashboard = ({ therapist }: { therapist: Therapist }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-muted/5">
      <div className="border-b bg-white">
        <div className="container max-w-6xl mx-auto flex items-center gap-4 py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/church/therapists")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Therapist Profile</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Profile Header */}
          <TherapistBasicInfo
            avatar={therapist.avatar}
            name={therapist.name}
            age={therapist.age}
            gender={therapist.gender}
            specialty={therapist.specialty}
            patients={therapist.patients}
            rating={therapist.rating}
          />

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-white">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="sessions"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Sessions
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <TherapistOverview
                education={therapist.education}
                experience={therapist.experience}
                languages={therapist.languages}
                availability={therapist.availability}
                bio={therapist.bio}
              />
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions">
              <TherapistSessions
                openNewSessionModal={() => setIsNewSessionModalOpen(true)}
                therapistId={therapist._id}
                availability={therapist.availability}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {therapist && (
        <>
          <EditTherapistModal
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            therapist={therapist}
          />
          <NewSessionModal
            open={isNewSessionModalOpen}
            onOpenChange={setIsNewSessionModalOpen}
            therapistId={therapist._id}
            availability={{
              days: therapist.availability.days,
              timeSlots: therapist.availability.timeSlots,
            }}
            onSessionCreated={() => {
              queryClient.invalidateQueries(["sessions", therapist._id]);
            }}
          />
        </>
      )}
    </div>
  );
};

export default TherapistDashboard;
