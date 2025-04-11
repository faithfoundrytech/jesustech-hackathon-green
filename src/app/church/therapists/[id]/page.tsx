"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Therapist } from "@/types/therapist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Mail, 
  Phone, 
  GraduationCap, 
  Languages, 
  Users,
  Star,
  ArrowLeft,
  Clock,
  Settings,
  Activity,
  Plus
} from "lucide-react";
import { useTherapists } from "@/hooks/use-therapists";
import { useQuery } from "@tanstack/react-query";
import { SessionsCalendar } from "@/components/therapist/sessions-calendar";
import { EditTherapistModal } from "@/components/therapist/edit-therapist-modal"
import { NewSessionModal } from "@/components/therapist/new-session-modal";
import { Sidebar } from "@/components/app/sidebar";

interface Session {
  id: string;
  title: string;
  start: string;
  end: string;
  patientId: string;
  patientName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const navigationTabs = [
  { name: 'Dashboard', href: '/church/dashboard' },
  { name: 'Therapists', href: '/church/therapists' },
  { name: 'Patients', href: '/church/patients' },
  { name: 'Appointments', href: '/church/appointments' },
];

export default function TherapistProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { fetchTherapistById } = useTherapists();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  const { data: fetchedTherapist, isLoading, error } = useQuery({
    queryKey: ['therapist', params.id],
    queryFn: () => fetchTherapistById(params.id as string),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (fetchedTherapist) {
      setTherapist(fetchedTherapist);
    }
  }, [fetchedTherapist]);

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
    <div className="flex h-full">
      <Sidebar tabs={navigationTabs} title="Church Dashboard" />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="flex flex-col min-h-screen bg-muted/5">
          {/* Top Navigation */}
          <div className="border-b bg-white">
            <div className="container max-w-6xl mx-auto flex items-center gap-4 py-4 px-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/therapists')}>
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
              <div className="grid gap-8 md:grid-cols-2">
                {/* Basic Info Card */}
                <Card className="shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={therapist.avatar} />
                        <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h2 className="text-2xl font-bold">{therapist.name}</h2>
                        <p className="text-muted-foreground">
                          {therapist.age} years • {therapist.gender}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {therapist.specialty}
                        </p>
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
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Active Patients</span>
                        </div>
                        <p className="text-2xl font-bold">{therapist.patients}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Rating</span>
                        </div>
                        <p className="text-2xl font-bold">{therapist.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-white">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Sessions
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Professional Details */}
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Education</p>
                            <p className="text-sm text-muted-foreground">{therapist.education}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Experience</p>
                            <p className="text-sm text-muted-foreground">{therapist.experience}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Languages</p>
                            <p className="text-sm text-muted-foreground">{therapist.languages.join(", ")}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Availability */}
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>Availability</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{therapist.availability.days.join(", ")}</span>
                        </div>
                        {therapist.availability.timeSlots.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Time Slots:</p>
                            <ul className="space-y-2">
                              {therapist.availability.timeSlots.map((slot, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{slot.start} - {slot.end}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bio */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{therapist.bio}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sessions Tab */}
                <TabsContent value="sessions">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Sessions</CardTitle>
                          <CardDescription>View and manage therapy sessions</CardDescription>
                        </div>
                        <Button onClick={() => setIsNewSessionModalOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Session
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <SessionsCalendar
                        therapistId={therapist._id}
                        availability={therapist.availability}
                        onSessionClick={(session: Session) => {
                          // Handle session click
                          console.log('Session clicked:', session);
                        }}
                        onDateSelect={(start: Date, end: Date) => {
                          // Handle date selection
                          console.log('Date range selected:', { start, end });
                        }}
                      />
                    </CardContent>
                  </Card>
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
                onSessionCreated={() => {
                  // Refresh sessions or update the calendar
                  console.log('Session created');
                }}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
} 