import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  
    Briefcase, 
    Clock,
    User,
  } from "lucide-react";
type BasicInfoCardProps = {
    avatar?: string;
    name: string;
    age: number;
    gender: string;
    occupation?: string;
    assignedTherapist?: string;
    preferredDays: string[];
}

const BasicInfoCard = ({avatar, name, age, gender, occupation, assignedTherapist, preferredDays}: BasicInfoCardProps) => {
    return (
        <div className="grid gap-8 md:grid-cols-2">
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          avatar ||
                          `/placeholder.svg?height=96&width=96`
                        }
                      />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h2 className="text-2xl font-bold">{name}</h2>
                      <p className="text-muted-foreground">
                        {age} years • {gender}
                      </p>
                      {occupation && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {occupation}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Preferred Days
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {preferredDays.join(", ")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Therapist</span>
                      </div>
                      <p className="text-sm text-muted-foreground"> 
                        {assignedTherapist || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
    )
}

export default BasicInfoCard;
