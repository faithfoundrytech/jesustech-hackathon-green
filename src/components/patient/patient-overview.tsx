"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  Briefcase, 
  Church, 
  Heart,
  Calendar,
  User
} from "lucide-react";

interface PatientOverviewProps {
  email: string;
  phone?: string;
  maritalStatus?: string;
  church?: string;
  occupation?: string;
  timeSlots?: {start: string; end: string}[];
  assignedTherapist?: {
    name: string;
    email: string;
    phone: string;
  };
}

export function PatientOverview({ email, phone, maritalStatus, church, occupation, timeSlots, assignedTherapist }: PatientOverviewProps) {
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
            <span className="text-sm">{email}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{phone}</span>
            </div>
          )}
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
            <span className="text-sm">Marital Status: {maritalStatus || "Not Specified"}</span>
          </div>
          {church && (
            <div className="flex items-center gap-2">
              <Church className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Church: {church}</span>
            </div>
          )}
          {occupation && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Occupation: {occupation}</span>
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
              {timeSlots?.map(slot => 
                `${slot.start} - ${slot.end}`
              ).join(", ") || "Not specified"}
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
              {assignedTherapist?.name || "Not assigned"}
            </span>
          </div>
          {assignedTherapist && (
            <div className="text-sm text-muted-foreground">
              <p>Email: {assignedTherapist.email}</p>
              <p>Phone: {assignedTherapist.phone}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 