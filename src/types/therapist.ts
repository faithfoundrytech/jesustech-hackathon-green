export interface TimeSlot {
  start: string;
  end: string;
}

export interface Availability {
  days: string[];
  timeSlots: TimeSlot[];
}

export interface SessionDetails {
  date: Date;
  duration: number; // in minutes
  notes?: string;
  feedback?: string;
}

export interface Patient {
  _id?: string;
  id: number;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  occupation?: string;
  church?: string;
  marriageDuration?: string;
  concerns: string;
  preferredDays: Availability;
  avatar?: string;
}

export interface Therapist {
  _id: number;
  name: string;
  age: number;
  maritalStatus: string;
  gender: string;
  specialty: string;
  availability: Availability;
  avatar: string;
  rating: number;
  experience: string;
  education: string;
  languages: string[];
  bio: string;
  patients: number;
}

export interface Session {
  id: number;
  therapist: Therapist;
  patient: Patient;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  matchScore: number;
  matchReason: string;
  challenges: string[];
  sessionDetails: SessionDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchResult {
  patient: Patient;
  therapist: Therapist;
  matchScore: number;
  matchReason: string;
  challenges: string[];
} 