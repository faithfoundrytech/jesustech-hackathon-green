"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Wand2, Users, Check, X, ChevronRight, Mail } from "lucide-react";
import { format, parse, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FaSms } from "react-icons/fa";

interface Patient {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  matchScore?: number;
  aiReasoning?: string;
  additionalInfo?: {
    preferredDays?: string[];
    preferredTimes?: string[];
    therapyGoals?: string[];
    previousSessions?: number;
  };
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

type ModalState = 'initial' | 'matching' | 'suggestions' | 'manual';

export function NewSessionModal({ 
  open, 
  onOpenChange, 
  therapistId, 
  availability,
  onSessionCreated 
}: NewSessionModalProps) {
  const [modalState, setModalState] = useState<ModalState>('initial');
  const [suggestedPatients, setSuggestedPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [numberOfSessions, setNumberOfSessions] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(60); // Default 60 minutes
  const [patientAvailability, setPatientAvailability] = useState<Availability | null>(null);
  const [existingSessions, setExistingSessions] = useState<Session[]>([]);
  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notificationChannels, setNotificationChannels] = useState<string[]>(['sms', 'email']);

  // Reset all state values to their initial state
  const resetModalState = () => {
    setModalState('initial');
    setSuggestedPatients([]);
    setSelectedPatient(null);
    setNumberOfSessions(6);
    setIsSubmitting(false);
    setSearchQuery("");
    setPatients([]);
    setDate(undefined);
    setStartTime("");
    setEndTime("");
    setNotes("");
    setIsSearching(false);
    setSelectedStartTime(null);
    setSessionDuration(60);
    setPatientAvailability(null);
    setExistingSessions([]);
    setExpandedPatients(new Set());
    setSelectedDate(null);
    setSelectedTime(null);
    setNotificationChannels(['sms', 'email']);
  };

  // Handle modal open change
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when modal is closed
      resetModalState();
    }
    onOpenChange(open);
  };

  const togglePatientExpansion = (patientId: string) => {
    setExpandedPatients(prev => {
      const newSet = new Set<string>();
      // If the clicked patient is not expanded, add it to the set
      if (!prev.has(patientId)) {
        newSet.add(patientId);
      }
      return newSet;
    });
  };

  const generateSchedulePreview = () => {
    if (!selectedDate || !selectedTime) return [];
    
    const schedule = [];
    const startDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startDate.setHours(hours, minutes);
    
    for (let i = 0; i < numberOfSessions; i++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(startDate.getDate() + (i * 7)); // Add 7 days for each session
      schedule.push(sessionDate);
    }
    
    return schedule;
  };

  // Update mock data to include AI reasoning and additional info
  const mockPatients: Patient[] = [
    { 
      _id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      matchScore: 0.92,
      aiReasoning: "Strong match based on expertise in anxiety disorders and availability during patient's preferred times.",
      additionalInfo: {
        preferredDays: ['Monday', 'Wednesday', 'Friday'],
        preferredTimes: ['Morning', 'Afternoon'],
        therapyGoals: ['Anxiety Management', 'Stress Reduction'],
        previousSessions: 12
      }
    },
    { 
      _id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      matchScore: 0.88,
      aiReasoning: "Good match for family therapy with experience in relationship counseling.",
      additionalInfo: {
        preferredDays: ['Tuesday', 'Thursday'],
        preferredTimes: ['Afternoon', 'Evening'],
        therapyGoals: ['Family Dynamics', 'Communication Skills'],
        previousSessions: 8
      }
    },
    { 
      _id: '3', 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      matchScore: 0.85,
      aiReasoning: "Suitable for trauma-focused therapy with flexible scheduling options.",
      additionalInfo: {
        preferredDays: ['Monday', 'Wednesday', 'Friday'],
        preferredTimes: ['Morning', 'Afternoon'],
        therapyGoals: ['Trauma Processing', 'Coping Strategies'],
        previousSessions: 5
      }
    },
  ];

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

  const handleStartMatching = () => {
    setModalState('matching');
    // Simulate matching process
    setTimeout(() => {
      setSuggestedPatients(mockPatients);
      setModalState('suggestions');
    }, 2000);
  };

  const handleApproveSuggestion = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Session suggestion approved successfully");
      onSessionCreated();
      resetModalState();
      onOpenChange(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleRejectSuggestion = () => {
    setSelectedPatient(null);
    setNumberOfSessions(6);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

      fetch('/api/sessions', {
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
          notificationChannels: notificationChannels.length > 0 ? notificationChannels : []
        }),
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to create session');
        return response.json();
      })
      .then(() => {
        toast.success("Session created successfully");
        onSessionCreated();
        resetModalState();
        onOpenChange(false);
      })
      .catch(error => {
        console.error('Error creating session:', error);
        toast.error("Failed to create session");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    } catch (error) {
      console.error('Error preparing session data:', error);
      toast.error("Failed to prepare session data");
      setIsSubmitting(false);
    }
  };

  // Add new function to get suggested schedule
  const getSuggestedSchedule = (patient: Patient) => {
    if (!patient.additionalInfo?.preferredDays?.length || !patient.additionalInfo?.preferredTimes?.length) {
      return null;
    }

    // Get the first preferred day and time
    const preferredDay = patient.additionalInfo.preferredDays[0];
    const preferredTime = patient.additionalInfo.preferredTimes[0];

    // Convert preferred time to 24-hour format
    const timeMap: Record<string, string> = {
      'Morning': '09:00',
      'Afternoon': '14:00',
      'Evening': '18:00'
    };

    const time = timeMap[preferredTime] || '09:00';

    // Find the next occurrence of the preferred day
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = days.indexOf(preferredDay);
    const currentDayIndex = today.getDay();
    
    let daysToAdd = targetDayIndex - currentDayIndex;
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    return {
      date: nextDate,
      time: time
    };
  };

  // Update the patient selection handler
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    togglePatientExpansion(patient._id);
    
    // Set suggested schedule
    const suggested = getSuggestedSchedule(patient);
    if (suggested) {
      setSelectedDate(suggested.date);
      setSelectedTime(suggested.time);
    }
  };

  // Update the schedule preview section
  const renderSchedulePreview = () => {
    if (!selectedDate || !selectedTime) {
      return (
        <div className="p-3 text-sm text-muted-foreground">
          No schedule suggested yet. Please select a patient to see suggested times.
        </div>
      );
    }

    return (
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </span>
          <span className="text-muted-foreground">
            at {format(parse(selectedTime, 'HH:mm', new Date()), 'h:mm a')}
          </span>
        </div>
        <div className="space-y-2">
          {generateSchedulePreview().map((date, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Session {index + 1}:</span>
              <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
              <span className="text-muted-foreground">
                at {format(parse(selectedTime, 'HH:mm', new Date()), 'h:mm a')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Toggle a specific notification channel
  const toggleNotificationChannel = (channel: string) => {
    setNotificationChannels(prev => 
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // Check if a specific channel is enabled
  const isChannelEnabled = (channel: string) => notificationChannels.includes(channel);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]" style={{ maxHeight: "85vh", overflow: "hidden" }}>
        <DialogHeader>
          <DialogTitle>New Session</DialogTitle>
        </DialogHeader>
        <div style={{ 
          overflowY: "auto", 
          maxHeight: "calc(85vh - 80px)"
        }}>
          {modalState === 'initial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 text-center p-6 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                     onClick={handleStartMatching}>
                  <div className="flex justify-center">
                    <Wand2 className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Automatic Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      Let AI find the perfect patient match for you
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-center p-6 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                     onClick={() => setModalState('manual')}>
                  <div className="flex justify-center">
                    <CalendarIcon className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Manual Schedule</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a patient and schedule manually
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {modalState === 'matching' && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="relative">
                  <Wand2 className="h-16 w-16 text-primary animate-pulse" />
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Finding Perfect Matches</h3>
                <p className="text-muted-foreground">
                  Analyzing patient profiles and availability...
                </p>
              </div>
            </div>
          )}

          {modalState === 'suggestions' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Suggested Patients</Label>
                <div className="space-y-2">
                  {suggestedPatients.map((patient) => (
                    <div key={patient._id}>
                      <div
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border cursor-pointer",
                          selectedPatient?._id === patient._id && "border-primary bg-primary/5",
                          "hover:bg-muted/50"
                        )}
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">{patient.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">
                            Match Score: {Math.round((patient.matchScore || 0) * 100)}%
                          </div>
                          <div
                            className={cn(
                              "p-1 rounded-full transition-transform duration-200",
                              expandedPatients.has(patient._id) ? "rotate-90" : ""
                            )}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      {expandedPatients.has(patient._id) && (
                        <div className="p-4 border-t bg-muted/30 space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">AI Reasoning</h4>
                            <p className="text-sm text-muted-foreground">{patient.aiReasoning}</p>
                          </div>
                          {patient.additionalInfo && (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <h4 className="text-sm font-medium">Preferred Days</h4>
                                <div className="flex flex-wrap gap-1">
                                  {patient.additionalInfo.preferredDays?.map((day, index) => (
                                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                                      {day}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-medium">Preferred Times</h4>
                                <div className="flex flex-wrap gap-1">
                                  {patient.additionalInfo.preferredTimes?.map((time, index) => (
                                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                                      {time}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-medium">Therapy Goals</h4>
                                <div className="flex flex-wrap gap-1">
                                  {patient.additionalInfo.therapyGoals?.map((goal, index) => (
                                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                                      {goal}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Previous Sessions: {patient.additionalInfo.previousSessions}
                              </div>
                            </div>
                          )}
                          <div className="pt-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Suggested Schedule</Label>
                              <div className="border rounded-md divide-y">
                                {renderSchedulePreview()}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Number of Sessions</Label>
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNumberOfSessions(Math.max(1, numberOfSessions - 1));
                                  }}
                                >
                                  -
                                </Button>
                                <div className="text-lg font-medium">{numberOfSessions}</div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNumberOfSessions(numberOfSessions + 1);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectSuggestion();
                                }}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveSuggestion();
                                }}
                                disabled={isSubmitting || !selectedDate || !selectedTime}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Approve
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {modalState === 'manual' && (
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

              {/* Notification Channel Toggles */}
              <div className="space-y-4">
                <Label>Notification Channels</Label>
                <div className="flex flex-col gap-4">
                  {/* SMS Toggle */}
                  <div 
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-md cursor-pointer",
                      isChannelEnabled('sms') 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-muted-foreground"
                    )}
                    onClick={() => toggleNotificationChannel('sms')}
                  >
                    <div className="flex items-center space-x-3">
                      <FaSms className={cn("h-5 w-5", isChannelEnabled('sms') ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("font-medium", isChannelEnabled('sms') ? "text-primary" : "")}>SMS Notification</span>
                    </div>
                    <div 
                      className={cn(
                        "w-10 h-5 rounded-full relative", 
                        isChannelEnabled('sms') ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div className={cn(
                        "absolute w-4 h-4 rounded-full bg-white top-[2px] transition-transform", 
                        isChannelEnabled('sms') ? "translate-x-5" : "translate-x-1"
                      )} />
                    </div>
                  </div>

                  {/* Email Toggle */}
                  <div 
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-md cursor-pointer",
                      isChannelEnabled('email') 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-muted-foreground"
                    )}
                    onClick={() => toggleNotificationChannel('email')}
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className={cn("h-5 w-5", isChannelEnabled('email') ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("font-medium", isChannelEnabled('email') ? "text-primary" : "")}>Email Notification</span>
                    </div>
                    <div 
                      className={cn(
                        "w-10 h-5 rounded-full relative", 
                        isChannelEnabled('email') ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div className={cn(
                        "absolute w-4 h-4 rounded-full bg-white top-[2px] transition-transform", 
                        isChannelEnabled('email') ? "translate-x-5" : "translate-x-1"
                      )} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Select how to notify the therapist and patient about this session</p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Schedule Session
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 