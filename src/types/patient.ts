export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  therapist?: {
    _id: string;
    name: string;
  };
  status: "active" | "pending" | "completed";
  lastSession?: string;
  progress: number;
} 