"use client";

import { useState } from 'react';
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
import { useTherapistSessions } from '@/hooks/use-sessions';

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
  title?: string;
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
  
  const { data: sessions = [] } = useTherapistSessions(therapistId);

  // Convert time slots to Date objects for comparison
  const availableTimeSlots = availability.timeSlots.map(slot => ({
    start: parse(slot.start, 'HH:mm', new Date()),
    end: parse(slot.end, 'HH:mm', new Date())
  }));
  
  const events = sessions.map(session => ({
    id: session._id,
    title: session.patientName,
    start: session.start,
    end: session.end,
    extendedProps: {
      status: session.status,
      patientId: session.patientId,
      count: 1
    },
    className: cn(
      'cursor-pointer transition-colors',
      session.status === 'completed' ? 'bg-green-500 border-green-600' :
      session.status === 'cancelled' ? 'bg-red-500 border-red-600' :
      ''
    )
  }));

  // Group events by day for month view
  const monthViewEvents = events.reduce((acc, event) => {
    const date = format(new Date(event.start), 'yyyy-MM-dd');
    const existingEvent = acc.find(e => e.start === date);
    
    console.log('Processing event:', {
      date,
      eventId: event.id,
      currentCount: existingEvent?.extendedProps.count || 0
    });
    
    if (existingEvent) {
      existingEvent.extendedProps.count = (existingEvent.extendedProps.count || 0) + 1;
      // Keep the most recent session's status for the dot color
      existingEvent.extendedProps.status = event.extendedProps.status;
    } else {
      acc.push({
        ...event,
        start: date,
        end: date,
        extendedProps: {
          ...event.extendedProps,
          count: 1
        }
      });
    }
    return acc;
  }, [] as Array<typeof events[0]>);

  // Debug log to check final counts
  console.log('Final month view events:', monthViewEvents.map(e => ({
    date: e.start,
    count: e.extendedProps.count,
    sessions: events.filter(ev => format(new Date(ev.start), 'yyyy-MM-dd') === e.start).length
  })));

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
  const slotLaneClassNames = (arg: { date?: Date }) => {
    if (arg.date && !isTimeSlotAvailable(arg.date)) {
      return 'bg-gray-100 opacity-50 cursor-not-allowed';
    }
    return '';
  };

  // Function to style unavailable days
  const dayCellClassNames = (arg: { date?: Date }) => {
    if (arg.date && !isDayAvailable(arg.date)) {
      return 'bg-gray-100 opacity-50 cursor-not-allowed';
    }
    return '';
  };

  const handleViewChange = (newView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay', date?: Date) => {
    setView(newView);
    if (calendarRef) {
      calendarRef.getApi().changeView(newView);
      // Force a re-render of events
      calendarRef.getApi().removeAllEvents();
      calendarRef.getApi().addEventSource(newView === 'dayGridMonth' ? monthViewEvents : events);
      
      // If a specific date is provided, navigate to that date
      if (date) {
        calendarRef.getApi().gotoDate(date);
      }
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
            // This event is triggered when the calendar view changes
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
              slotMinTime: '07:00:00',
              slotMaxTime: '20:00:00',
              slotDuration: '00:30:00',
              slotLabelInterval: '01:00',
              dayHeaderFormat: { weekday: 'short', day: 'numeric' },
            },
            timeGridDay: {
              slotMinTime: '07:00:00',
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
            if (session) {
              if (onSessionClick) {
                onSessionClick(session);
              }
              // Switch to day view and focus on the session's date
              handleViewChange('timeGridDay', new Date(session.start));
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
            // For month view, show dots
            if (eventInfo.view.type === 'dayGridMonth') {
              const startDate = eventInfo.event.start;
              if (!startDate) return null;
              
              const eventDate = format(new Date(startDate), 'yyyy-MM-dd');
              const dayEvents = events.filter(e => {
                if (!e.start) return false;
                return format(new Date(e.start), 'yyyy-MM-dd') === eventDate;
              });
              
              return (
                <div className="relative h-full w-full">
                  {dayEvents.map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-2 h-2 rounded-full bg-primary"
                      style={{ left: `${i * 12}px`, top: '50%', transform: 'translateY(-50%)' }}
                    />
                  ))}
                </div>
              );
            }
            
            // For week and day views, show full details
            return (
              <div className="p-1 text-sm truncate">
                <div className="font-medium truncate">{eventInfo.event.title}</div>
                <div className="text-xs opacity-75 hidden sm:block">
                  {eventInfo.timeText}
                </div>
              </div>
            );
          }}
          eventClassNames={(arg) => {
            if (arg.view.type === 'dayGridMonth') {
              return '!bg-transparent !border-0 !p-0';
            }
            return '';
          }}
        />
      </div>
    </Card>
  );
} 