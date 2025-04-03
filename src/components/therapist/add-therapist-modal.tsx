"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Therapist } from "@/types/therapist"
import { useTherapists } from "@/hooks/use-therapists"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Resolver } from "react-hook-form"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(18, "Age must be at least 18"),
  maritalStatus: z.string(),
  gender: z.string(),
  specialty: z.string().min(2, "Specialty must be at least 2 characters"),
  experience: z.string(),
  education: z.string().min(2, "Education must be at least 2 characters"),
  languages: z.string().transform((val) => val.split(",").map((lang) => lang.trim())),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  availability: z.object({
    days: z.array(z.string()).min(1, "Select at least one day"),
    timeSlots: z.array(z.object({
      start: z.string(),
      end: z.string()
    })).min(1, "Add at least one time slot")
  })
})

type FormValues = z.infer<typeof formSchema>

interface AddTherapistModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function AddTherapistModal({ open, setOpen }: AddTherapistModalProps) {
  const { createTherapist, isCreating, createError, refetch } = useTherapists();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      age: 18,
      maritalStatus: "",
      gender: "",
      specialty: "",
      experience: "",
      education: "",
      languages: "",
      bio: "",
      availability: {
        days: [],
        timeSlots: [{ start: "09:00", end: "17:00" }]
      }
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const therapistData = {
        ...values,
      } as Omit<Therapist, "rating" | "avatar">;
      
      await createTherapist(therapistData);
      refetch();
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating therapist:', error);
    }
  }

  const addTimeSlot = () => {
    const currentTimeSlots = form.getValues("availability.timeSlots");
    form.setValue("availability.timeSlots", [
      ...currentTimeSlots,
      { start: "09:00", end: "17:00" }
    ]);
  };

  const removeTimeSlot = (index: number) => {
    const currentTimeSlots = form.getValues("availability.timeSlots");
    form.setValue(
      "availability.timeSlots",
      currentTimeSlots.filter((_, i) => i !== index)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Therapist</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new therapist to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {createError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {createError instanceof Error ? createError.message : 'Failed to create therapist'}
                </AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Anxiety and Stress Management" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="8 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Input placeholder="Ph.D. in Clinical Psychology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <Input placeholder="English, Swahili" {...field} />
                  </FormControl>
                  <FormDescription>
                    Separate languages with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of expertise and approach" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability.days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Days</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={day}
                          checked={field.value.includes(day)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, day]
                              : field.value.filter((d) => d !== day);
                            field.onChange(newValue);
                          }}
                        />
                        <label htmlFor={day}>{day}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Time Slots</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimeSlot}
                >
                  Add Time Slot
                </Button>
              </div>
              {form.watch("availability.timeSlots").map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`availability.timeSlots.${index}.start`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span>to</span>
                  <FormField
                    control={form.control}
                    name={`availability.timeSlots.${index}.end`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeSlot(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Adding..." : "Add Therapist"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 