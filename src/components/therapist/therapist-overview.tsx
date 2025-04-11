import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  import {
    Calendar,
    GraduationCap,
    Languages,
    Clock,
  } from "lucide-react";

type TherapistOverviewProps = {
   education: string;
   experience: string;
   languages: string[];
   availability: {
    days: string[];
    timeSlots: { start: string; end: string }[];
   };
   bio: string;
}

const TherapistOverview = ({education, experience, languages, availability, bio}: TherapistOverviewProps) => {
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Professional Details */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Education</p>
                <p className="text-sm text-muted-foreground">
                  {education}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Experience</p>
                <p className="text-sm text-muted-foreground">
                  {experience}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Languages</p>
                <p className="text-sm text-muted-foreground">
                  {languages.join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{availability.days.join(", ")}</span>
            </div>
            {availability.timeSlots.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Time Slots:</p>
                <ul className="space-y-2">
                  {availability.timeSlots.map((slot, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {slot.start} - {slot.end}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bio */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{bio}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistOverview;
