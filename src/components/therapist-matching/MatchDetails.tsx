import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Patient, Therapist, Session } from "@/types/therapist"

interface MatchDetailsProps {
  selectedPatient: Patient | null
  therapists: Therapist[]
  activeSession: Session | null
  onApproveMatch: (patientId: number) => void
  onAssignTherapist: (patientId: number, therapistId: number) => void
}

export function MatchDetails({ 
  selectedPatient, 
  therapists = [],
  activeSession,
  onApproveMatch,
  onAssignTherapist 
}: MatchDetailsProps) {
  // Find the currently assigned therapist from the active session
  const assignedTherapist = activeSession?.therapist || null;

  return (
    <Card className="lg:col-span-1 flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle>Match Details</CardTitle>
        <CardDescription>
          {selectedPatient
            ? "Review and approve the suggested match"
            : "Select a patient to view match details"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {selectedPatient ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">{selectedPatient.name}</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{selectedPatient.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concerns:</span>
                  <span>{selectedPatient.concerns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preferred Days:</span>
                  <span>{selectedPatient.preferredDays.days.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Match:</span>
                  <span className={activeSession ? "text-green-600" : "text-red-600"}>
                    {assignedTherapist?.name || "Unmatched"}
                  </span>
                </div>
              </div>
            </div>

            {/* Match Details */}
            {activeSession && (
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Match Information</h4>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Therapist:</span>
                    <span>{assignedTherapist?.name}</span>
                  </div>
                  {activeSession.sessionDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Session Date:</span>
                        <span>{new Date(activeSession.sessionDetails.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Session Duration:</span>
                        <span>{activeSession.sessionDetails.duration} minutes</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Match Score:</span>
                    <span>{activeSession.matchScore}%</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-green-700 dark:text-green-300">Match Reasoning</h5>
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                      {activeSession.matchReason}
                    </p>
                  </div>

                  {/* Challenges */}
                  {activeSession.challenges.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-green-700 dark:text-green-300">Considerations</h5>
                      <ul className="mt-1 text-sm text-green-600 dark:text-green-400 list-disc list-inside">
                        {activeSession.challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {therapists && therapists.length > 0 && (
              <>
                <div>
                  <Label htmlFor="therapist-select">Assign Therapist</Label>
                  <Select 
                    value={assignedTherapist?.id.toString() || ""}
                    onValueChange={(value) => onAssignTherapist(selectedPatient.id, Number.parseInt(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a therapist" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapists.map((therapist) => (
                        <SelectItem key={therapist.id} value={therapist.id.toString()}>
                          {therapist.name} - {therapist.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recommended Matches</h4>
                  <div className="space-y-2">
                    {therapists.slice(0, 3).map((therapist) => (
                      <div 
                        key={therapist.id} 
                        className={`flex items-center justify-between rounded-md border p-2 ${
                          assignedTherapist?.id === therapist.id ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={therapist.avatar} alt={therapist.name} />
                            <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{therapist.name}</p>
                            <p className="text-xs text-muted-foreground">{therapist.specialty}</p>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={assignedTherapist?.id === therapist.id ? "default" : "ghost"}
                                size="sm"
                                onClick={() => onAssignTherapist(selectedPatient.id, therapist.id)}
                              >
                                {assignedTherapist?.id === therapist.id ? "Selected" : "Assign"}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{assignedTherapist?.id === therapist.id ? "Currently assigned" : `Assign ${therapist.name}`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Users className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Patient Selected</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a patient from the list to view details and make a match
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t">
        <Button variant="outline">Reset</Button>
        <Button 
          disabled={!activeSession}
          onClick={() => selectedPatient && onApproveMatch(selectedPatient.id)}
        >
          Approve Match
        </Button>
      </CardFooter>
    </Card>
  )
} 