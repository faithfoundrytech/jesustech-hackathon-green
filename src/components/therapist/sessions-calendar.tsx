"use client";

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { format, parse, isWithinInterval } from 'date-fns';
import { toast } from "sonner";

interface TimeSlot {
  start: string;
  end: string;
}

interface Availability {
  days: string[];
  timeSlots: TimeSlot[];
  startTime: string;
  endTime: string;
}

interface Session {
  _id: string;
  title: string;
  start: string;
  end: string;
  patientId: string;
  patientName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface SessionsCalendarProps {
  therapistId: string;
  availability: Availability;
  onSessionClick?: (session: Session) => void;
  onDateSelect?: (start: Date, end: Date) => void;
}

export function SessionsCalendar({ therapistId, availability, onSessionClick, onDateSelect }: SessionsCalendarProps) {
  const [calendarRef, setCalendarRef] = useState<any>(null);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sessions when component mounts
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        console.log('Fetching sessions for therapist:', therapistId);
        const response = await fetch(`/api/sessions?therapistId=${therapistId}`);
        if (!response.ok) throw new Error('Failed to fetch sessions');
        const data = await response.json();
        console.log('Received sessions:', data);
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [therapistId]);

  // Convert time slots to Date objects for comparison
  const availableTimeSlots = availability.timeSlots.map(slot => ({
    start: parse(slot.start, 'HH:mm', new Date()),
    end: parse(slot.end, 'HH:mm', new Date())
  }));
  
  const events = sessions.map(session => {
    console.log('Processing session:', session);
    return {
      id: session._id,
      title: session.patientName,
      start: session.start,
      end: session.end,
      extendedProps: {
        status: session.status,
        patientId: session.patientId
      },
      className: cn(
        'cursor-pointer transition-colors',
        session.status === 'completed' ? 'bg-green-500 border-green-600' :
        session.status === 'cancelled' ? 'bg-red-500 border-red-600' :
        'bg-primary border-primary-600'
      )
    };
  });

  console.log('Generated events:', events);

  // Function to check if a time slot is within therapist's availability
  const isTimeSlotAvailable = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE'); // Get day name
    // Convert both to lowercase for case-insensitive comparison
    if (!availability.days.some(day => day.toLowerCase() === dayOfWeek.toLowerCase())) {
      return false;
    }

    const time = parse(format(date, 'HH:mm'), 'HH:mm', new Date());
    return availableTimeSlots.some(slot => 
      isWithinInterval(time, { start: slot.start, end: slot.end })
    );
  };

  // Function to check if a day is within therapist's availability
  const isDayAvailable = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE'); // Get day name
    // Convert both to lowercase for case-insensitive comparison
    return availability.days.some(day => 
      day.toLowerCase() === dayOfWeek.toLowerCase()
    );
  };

  // Function to style unavailable time slots
  const slotLaneClassNames = (arg: any) => {
    if (!isTimeSlotAvailable(arg.date)) {
      return 'bg-gray-100 opacity-50 cursor-not-allowed';
    }
    return '';
  };

  // Function to style unavailable days
  const dayCellClassNames = (arg: any) => {
    if (!isDayAvailable(arg.date)) {
      return 'bg-gray-100 opacity-50 cursor-not-allowed';
    }
    return '';
  };

  const handleViewChange = (newView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    setView(newView);
    if (calendarRef) {
      calendarRef.getApi().changeView(newView);
    }
  };

  const handleDateChange = (action: 'prev' | 'next' | 'today') => {
    if (calendarRef) {
      const api = calendarRef.getApi();
      if (action === 'prev') {
        api.prev();
      } else if (action === 'next') {
        api.next();
      } else {
        api.today();
      }
      setCurrentDate(api.getDate());
    }
  };

  const getDateRangeText = () => {
    if (!calendarRef) return '';
    
    const api = calendarRef.getApi();
    const currentView = api.view;
    const start = currentView.currentStart;
    const end = currentView.currentEnd;

    switch (view) {
      case 'dayGridMonth':
        return format(start, 'MMMM yyyy');
      case 'timeGridWeek':
        return `${format(start, 'MMM d')} - ${format(new Date(end.getTime() - 1), 'MMM d, yyyy')}`;
      case 'timeGridDay':
        return format(start, 'MMMM d, yyyy');
      default:
        return '';
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-col gap-4 border-b p-4">
        {/* Date Range and Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleDateChange('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleDateChange('today')}
              className="hidden sm:inline-flex"
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleDateChange('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 text-center font-semibold text-lg">
            {getDateRangeText()}
          </div>
          <div className="hidden sm:block">
            <Select
              value={view}
              onValueChange={(value: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => handleViewChange(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dayGridMonth">Month</SelectItem>
                <SelectItem value="timeGridWeek">Week</SelectItem>
                <SelectItem value="timeGridDay">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center justify-center sm:justify-start gap-1">
          <Button 
            variant={view === 'dayGridMonth' ? 'default' : 'outline'} 
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => handleViewChange('dayGridMonth')}
          >
            <LayoutGrid className="h-4 w-4 mr-2 sm:mr-0 sm:hidden" />
            <span className="sm:hidden">Month</span>
            <LayoutGrid className="h-4 w-4 hidden sm:block" />
          </Button>
          <Button 
            variant={view === 'timeGridWeek' ? 'default' : 'outline'} 
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => handleViewChange('timeGridWeek')}
          >
            <CalendarIcon className="h-4 w-4 mr-2 sm:mr-0 sm:hidden" />
            <span className="sm:hidden">Week</span>
            <CalendarIcon className="h-4 w-4 hidden sm:block" />
          </Button>
          <Button 
            variant={view === 'timeGridDay' ? 'default' : 'outline'} 
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => handleViewChange('timeGridDay')}
          >
            <List className="h-4 w-4 mr-2 sm:mr-0 sm:hidden" />
            <span className="sm:hidden">Day</span>
            <List className="h-4 w-4 hidden sm:block" />
          </Button>
        </div>
      </div>

      <div className="p-2 sm:p-4">
        <FullCalendar
          ref={(ref) => setCalendarRef(ref)}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          datesSet={(dateInfo) => {
            setCurrentDate(dateInfo.view.currentStart);
          }}
          views={{
            dayGridMonth: {
              dayMaxEvents: 2,
              selectable: true,
              selectConstraint: {
                startTime: availability.timeSlots[0]?.start || '08:00',
                endTime: availability.timeSlots[0]?.end || '20:00',
                dows: availability.days.map(day => {
                  const dayMap: { [key: string]: number } = {
                    'Sunday': 0,
                    'Monday': 1,
                    'Tuesday': 2,
                    'Wednesday': 3,
                    'Thursday': 4,
                    'Friday': 5,
                    'Saturday': 6
                  };
                  return dayMap[day];
                })
              }
            },
            timeGridWeek: {
              slotMinTime: '08:00:00',
              slotMaxTime: '20:00:00',
              slotDuration: '00:30:00',
              slotLabelInterval: '01:00',
              dayHeaderFormat: { weekday: 'short', day: 'numeric' },
            },
            timeGridDay: {
              slotMinTime: '08:00:00',
              slotMaxTime: '20:00:00',
              slotDuration: '00:30:00',
              slotLabelInterval: '01:00',
            }
          }}
          events={events}
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          nowIndicator={true}
          slotEventOverlap={false}
          allDaySlot={false}
          headerToolbar={false}
          slotLaneClassNames={slotLaneClassNames}
          dayCellClassNames={dayCellClassNames}
          selectConstraint={{
            startTime: availability.timeSlots[0]?.start || '08:00',
            endTime: availability.timeSlots[0]?.end || '20:00',
            dows: availability.days.map(day => {
              const dayMap: { [key: string]: number } = {
                'Sunday': 0,
                'Monday': 1,
                'Tuesday': 2,
                'Wednesday': 3,
                'Thursday': 4,
                'Friday': 5,
                'Saturday': 6
              };
              return dayMap[day];
            })
          }}
          eventClick={(info) => {
            const session = sessions.find(s => s._id === info.event.id);
            if (session && onSessionClick) {
              onSessionClick(session);
            }
          }}
          select={(info) => {
            if (onDateSelect) {
              onDateSelect(info.start, info.end);
            }
          }}
          height="auto"
          expandRows={true}
          stickyHeaderDates={true}
          eventContent={(eventInfo) => {
            return (
              <div className="p-1 text-sm truncate">
                <div className="font-medium truncate">{eventInfo.event.title}</div>
                <div className="text-xs opacity-75 hidden sm:block">
                  {eventInfo.timeText}
                </div>
              </div>
            );
          }}
        />
      </div>
    </Card>
  );
} 