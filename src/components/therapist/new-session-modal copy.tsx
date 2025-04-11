"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Loader2 } from "lucide-react";
import { format, parse, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Patient {
  _id: string;
  name: string;
  email: string;
  availability?: {
    days: string[];
    timeSlots: TimeSlot[];
  };
}

interface TimeSlot {
  start: string;
  end: string;
  isSelected?: boolean;
}

interface Availability {
  days: string[];
  timeSlots: TimeSlot[];
}

interface Session {
  _id: string;
  start: string;
  end: string;
}

interface NewSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  therapistId: string;
  availability: Availability;
  onSessionCreated: () => void;
}

export function NewSessionModal({ 
  open, 
  onOpenChange, 
  therapistId, 
  availability,
  onSessionCreated 
}: NewSessionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(60); // Default 60 minutes
  const [patientAvailability, setPatientAvailability] = useState<Availability | null>(null);
  const [existingSessions, setExistingSessions] = useState<Session[]>([]);

  // Convert time slots to Date objects for comparison
  const availableTimeSlots = availability.timeSlots.map(slot => ({
    start: parse(slot.start, 'HH:mm', new Date()),
    end: parse(slot.end, 'HH:mm', new Date())
  }));

  // Check if a day is available based on therapist's schedule
  const isDayAvailable = (date: Date) => {
    const dayName = format(date, 'EEEE').toLowerCase();
    return availability.days.some(day => day.toLowerCase() === dayName);
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (time: string) => {
    const timeDate = parse(time, 'HH:mm', new Date());
    return availableTimeSlots.some(slot => 
      isWithinInterval(timeDate, { start: slot.start, end: slot.end })
    );
  };

  // Fetch patient availability when selected
  useEffect(() => {
    const fetchPatientAvailability = async () => {
      if (!selectedPatient) {
        setPatientAvailability(null);
        return;
      }

      try {
        const response = await fetch(`/api/patients/${selectedPatient._id}`);
        if (!response.ok) throw new Error('Failed to fetch patient availability');
        const data = await response.json();
        setPatientAvailability(data.availability || null);
      } catch (error) {
        console.error('Error fetching patient availability:', error);
        toast.error("Failed to fetch patient availability");
      }
    };

    fetchPatientAvailability();
  }, [selectedPatient]);

  // Fetch existing sessions when patient or date changes
  useEffect(() => {
    const fetchExistingSessions = async () => {
      if (!selectedPatient || !date) {
        setExistingSessions([]);
        return;
      }

      try {
        // Fetch sessions for both patient and therapist for the selected date
        const [patientSessions, therapistSessions] = await Promise.all([
          fetch(`/api/sessions?patientId=${selectedPatient._id}&date=${format(date, 'yyyy-MM-dd')}`),
          fetch(`/api/sessions?therapistId=${therapistId}&date=${format(date, 'yyyy-MM-dd')}`)
        ]);

        if (!patientSessions.ok || !therapistSessions.ok) {
          throw new Error('Failed to fetch existing sessions');
        }

        const patientData = await patientSessions.json();
        const therapistData = await therapistSessions.json();

        // Combine and deduplicate sessions
        const allSessions = [...patientData, ...therapistData];
        const uniqueSessions = allSessions.filter((session, index, self) =>
          index === self.findIndex(s => s._id === session._id)
        );
        console.log('Unique sessions:', uniqueSessions);
        setExistingSessions(uniqueSessions);
      } catch (error) {
        console.error('Error fetching existing sessions:', error);
        toast.error("Failed to fetch existing sessions");
      }
    };

    fetchExistingSessions();
  }, [selectedPatient, date, therapistId]);

  // Check if a time slot conflicts with existing sessions
  const isTimeSlotConflicting = (time: string) => {
    if (!date || existingSessions.length === 0) return false;

    const selectedStart = parse(time, 'HH:mm', new Date());
    const selectedEnd = new Date(selectedStart.getTime() + sessionDuration * 60000);

    // Set the date part of the times to match the selected date
    selectedStart.setFullYear(date.getFullYear());
    selectedStart.setMonth(date.getMonth());
    selectedStart.setDate(date.getDate());
    selectedEnd.setFullYear(date.getFullYear());
    selectedEnd.setMonth(date.getMonth());
    selectedEnd.setDate(date.getDate());

    return existingSessions.some(session => {
      const sessionStart = new Date(session.start);
      const sessionEnd = new Date(session.end);

      return (
        (selectedStart >= sessionStart && selectedStart < sessionEnd) ||
        (selectedEnd > sessionStart && selectedEnd <= sessionEnd) ||
        (selectedStart <= sessionStart && selectedEnd >= sessionEnd)
      );
    });
  };

  // Check if a time slot is available for both therapist and patient
  const isTimeSlotAvailableForBoth = (time: string) => {
    if (!date) return false;

    // 1. Check if the day is available for therapist
    const dayName = format(date, 'EEEE').toLowerCase();
    const isDayAvailableForTherapist = availability.days.some(
      day => day.toLowerCase() === dayName
    );
    if (!isDayAvailableForTherapist) return false;

    // 2. Check if the time slot is within therapist's availability
    const timeDate = parse(time, 'HH:mm', new Date());
    const isAvailableInTherapistSchedule = availableTimeSlots.some(slot => 
      isWithinInterval(timeDate, { start: slot.start, end: slot.end })
    );
    if (!isAvailableInTherapistSchedule) return false;

    // 3. Check if there are any conflicting sessions
    if (isTimeSlotConflicting(time)) return false;

    // 4. If patient is selected, check their availability
    if (selectedPatient && patientAvailability) {
      // Check if the day is available for patient
      const isDayAvailableForPatient = patientAvailability.days.some(
        day => day.toLowerCase() === dayName
      );
      if (!isDayAvailableForPatient) return false;

      // Check if the time slot is within patient's availability
      const patientTimeSlots = patientAvailability.timeSlots.map(slot => ({
        start: parse(slot.start, 'HH:mm', new Date()),
        end: parse(slot.end, 'HH:mm', new Date())
      }));

      const isAvailableInPatientSchedule = patientTimeSlots.some(slot => 
        isWithinInterval(timeDate, { start: slot.start, end: slot.end })
      );
      if (!isAvailableInPatientSchedule) return false;
    }

    return true;
  };

  // Generate available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!date || !isDayAvailable(date)) return [];

    return availableTimeSlots.map(slot => ({
      start: format(slot.start, 'HH:mm'),
      end: format(slot.end, 'HH:mm')
    }));
  };

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    if (!date || !isDayAvailable(date)) return [];

    const slots: string[] = [];
    const interval = 30; // 30-minute intervals

    // For each available time slot in therapist's schedule
    availableTimeSlots.forEach(availableSlot => {
      let currentTime = new Date(availableSlot.start);
      const endTime = new Date(availableSlot.end);

      while (currentTime < endTime) {
        const timeStr = format(currentTime, 'HH:mm');
        const endTimeForSlot = new Date(currentTime.getTime() + sessionDuration * 60000);

        // Only add the slot if the full duration fits within the available time slot
        if (endTimeForSlot <= endTime) {
          slots.push(timeStr);
        }

        currentTime = new Date(currentTime.getTime() + interval * 60000);
      }
    });

    return slots;
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    setSelectedStartTime(time);
    setStartTime(time);
    
    // Calculate end time based on duration
    const startDate = parse(time, 'HH:mm', new Date());
    const endDate = new Date(startDate.getTime() + sessionDuration * 60000);
    setEndTime(format(endDate, 'HH:mm'));
  };

  // Search patients when query changes
  useEffect(() => {
    const searchPatients = async () => {
      if (searchQuery.length < 2) {
        setPatients([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/patients/search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error('Failed to search patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error searching patients:', error);
        toast.error("Failed to search patients");
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !date || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate time slot
    if (!isTimeSlotAvailable(startTime) || !isTimeSlotAvailable(endTime)) {
      toast.error("Selected time slot is not available");
      return;
    }

    setIsSubmitting(true);
    try {
      const start = new Date(date);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      start.setHours(startHours, startMinutes);

      const end = new Date(date);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      end.setHours(endHours, endMinutes);

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          therapistId,
          start: start.toISOString(),
          end: end.toISOString(),
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      toast.success("Session created successfully");
      onSessionCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error("Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" style={{ maxHeight: "85vh" }}>
        <DialogHeader>
          <DialogTitle>New Session</DialogTitle>
        </DialogHeader>
        <div style={{ 
          overflowY: "auto", 
          maxHeight: "calc(85vh - 100px)",
          paddingRight: "5px"
        }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <div className="relative">
                <Input
                  id="patient"
                  placeholder="Search for a patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                )}
              </div>
              {patients.length > 0 && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {patients.map((patient) => (
                    <button
                      key={patient._id}
                      type="button"
                      className={cn(
                        "w-full text-left px-4 py-2 hover:bg-muted",
                        selectedPatient?._id === patient._id && "bg-muted"
                      )}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setSearchQuery(patient.name);
                        setPatients([]);
                      }}
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => !isDayAvailable(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {date && isDayAvailable(date) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Duration</Label>
                  <div className="flex gap-2">
                    {[30, 60, 90, 120].map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        className={cn(
                          "flex-1 py-2 px-3 rounded-md border text-sm",
                          sessionDuration === duration
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                        onClick={() => {
                          setSessionDuration(duration);
                          if (selectedStartTime) {
                            const startDate = parse(selectedStartTime, 'HH:mm', new Date());
                            const endDate = new Date(startDate.getTime() + duration * 60000);
                            setEndTime(format(endDate, 'HH:mm'));
                          }
                        }}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Start Times</Label>
                  <div className="flex flex-wrap gap-2">
                    {generateTimeSlots().map((time, index) => {
                      const isAvailable = isTimeSlotAvailableForBoth(time);
                      const isConflicting = isTimeSlotConflicting(time);
                      const isInPatientSchedule = patientAvailability 
                        ? patientAvailability.timeSlots.some(slot => {
                            const slotStart = parse(slot.start, 'HH:mm', new Date());
                            const slotEnd = parse(slot.end, 'HH:mm', new Date());
                            const timeDate = parse(time, 'HH:mm', new Date());
                            return isWithinInterval(timeDate, { start: slotStart, end: slotEnd });
                          })
                        : true;

                      return (
                        <button
                          key={index}
                          type="button"
                          className={cn(
                            "py-2 px-3 rounded-md border text-sm relative",
                            selectedStartTime === time
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted",
                            !isAvailable && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => isAvailable && handleTimeSlotSelect(time)}
                          disabled={!isAvailable}
                          title={
                            !isAvailable
                              ? isConflicting
                                ? "This time slot conflicts with an existing session"
                                : !isInPatientSchedule
                                  ? "This time slot is not available in the patient's schedule"
                                  : "This time slot is not available"
                              : undefined
                          }
                        >
                          {format(parse(time, 'HH:mm', new Date()), 'h:mm a')}
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-px bg-muted-foreground transform rotate-45" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedPatient && patientAvailability && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Showing all time slots with availability indicators:</p>
                      <ul className="list-disc list-inside">
                        <li>Available slots can be selected</li>
                        <li>Slots with strikethrough are unavailable due to:
                          <ul className="list-disc list-inside ml-4">
                            <li>Existing sessions</li>
                            <li>Patient's schedule conflicts</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {selectedStartTime && (
                  <div className="space-y-2">
                    <Label>Selected Session</Label>
                    <div className="p-2 rounded-md border bg-muted/50">
                      {format(parse(selectedStartTime, 'HH:mm', new Date()), 'h:mm a')} - 
                      {format(parse(endTime, 'HH:mm', new Date()), 'h:mm a')}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({sessionDuration} minutes)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about the session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Session
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 