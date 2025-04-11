"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  Briefcase, 
  Church, 
  Heart,
  Calendar,
  Clock,
  User
} from "lucide-react";
import { Patient } from "@/types/therapist";

interface PatientOverviewProps {
  patient: Patient;
}

export function PatientOverview({ patient }: PatientOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{patient.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{patient.phone}</span>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Marital Status: {patient.maritalStatus}</span>
          </div>
          <div className="flex items-center gap-2">
            <Church className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Religion: {patient.religion}</span>
          </div>
          {patient.occupation && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Occupation: {patient.occupation}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Preferred Days</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {patient.preferredDays.days.join(", ")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Preferred Times</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {patient.preferredDays.timeSlots.map(slot => 
                `${slot.start} - ${slot.end}`
              ).join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Therapist Information */}
      <Card>
        <CardHeader>
          <CardTitle>Therapist Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {patient.assignedTherapist?.name || "Not assigned"}
            </span>
          </div>
          {patient.assignedTherapist && (
            <div className="text-sm text-muted-foreground">
              <p>Email: {patient.assignedTherapist.email}</p>
              <p>Phone: {patient.assignedTherapist.phone}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 