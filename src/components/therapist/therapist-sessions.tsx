import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SessionsCalendar } from "@/components/therapist/sessions-calendar";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { Availability, Session } from "@/types/therapist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TherapistSessionProps = {
  therapistId: string;
  openNewSessionModal: () => void;
  availability: Availability;
};

const TherapistSessions = ({
  openNewSessionModal,
  therapistId,
  availability,
}: TherapistSessionProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>View and manage therapy sessions</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={openNewSessionModal}>
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Sparkles className="h-4 w-4 mr-2" />
                Auto Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <SessionsCalendar
          therapistId={therapistId}
          availability={availability}
          onSessionClick={(session: Session) => {
            // Handle session click
            console.log("Session clicked:", session);
          }}
          onDateSelect={(start: Date, end: Date) => {
            // Handle date selection
            console.log("Date range selected:", { start, end });
          }}
        />
      </CardContent>
    </Card>
  );
};

export default TherapistSessions;
