import {
    Card,
    CardContent,
  } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    GraduationCap,
    Users,
    Star,

  } from "lucide-react";

type TherapistBasicInfoProps = {
    avatar: string;
    name: string;
    age: number;
    gender: string;
    specialty: string;
    patients: number;
    rating: number;
}
  
const TherapistBasicInfo = ({avatar, name, age, gender, specialty, patients, rating}: TherapistBasicInfoProps) => {
    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* Basic Info Card */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-muted-foreground">
                      {age} years • {gender}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {specialty}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Active Patients
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{patients}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Rating</span>
                    </div>
                    <p className="text-2xl font-bold">{rating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
    )
}

export default TherapistBasicInfo;
