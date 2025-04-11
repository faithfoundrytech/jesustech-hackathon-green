"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSessions } from "@/hooks/use-sessions";

interface SessionsTabProps {
  patientId: string;
}

export function SessionsTab({ patientId }: SessionsTabProps) {
  const { data: sessions = [], isLoading } = useSessions(patientId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading sessions...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No sessions scheduled yet
          </CardContent>
        </Card>
      ) : (
        sessions.map((session) => (
          <Card key={session._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{session.therapistName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(new Date(session.start), 'PPP')}</span>
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(session.start), 'h:mm a')} - {format(new Date(session.end), 'h:mm a')}
                    </span>
                  </div>
                  {session.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">{session.notes}</p>
                  )}
                </div>
                <span className={cn(
                  "rounded-full px-2 py-1 text-xs",
                  session.status === 'scheduled' && "bg-blue-100 text-blue-800",
                  session.status === 'completed' && "bg-green-100 text-green-800",
                  session.status === 'cancelled' && "bg-red-100 text-red-800"
                )}>
                  {session.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
} 