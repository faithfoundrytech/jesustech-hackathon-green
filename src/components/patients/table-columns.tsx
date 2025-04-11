import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Plus, Upload, ExternalLink } from "lucide-react";
import { Patient } from "@/types/therapist";
import Link from "next/link";

export const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            {row.original.name.charAt(0)}
          </div>
          <div className="flex-1">
            <Link 
              href={`/church/patients/${row.original._id}`}
              className="font-medium hover:underline flex items-center gap-2"
            >
              {row.original.name}
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
            <div className="text-sm text-muted-foreground">
              Age: {row.original.age} • {row.original.gender}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="text-sm space-y-1">
          {row.original.email && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Email:</span>
              {row.original.email}
            </div>
          )}
          {row.original.phone && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Phone:</span>
              {row.original.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: "Additional Details",
      cell: ({ row }) => (
        <div className="text-sm space-y-1">
          {row.original.occupation && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Occupation:</span>
              {row.original.occupation}
            </div>
          )}
          {row.original.church && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Church:</span>
              {row.original.church}
            </div>
          )}
          {row.original.marriageDuration && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Marriage Duration:</span>
              {row.original.marriageDuration}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "concerns",
      header: "Concerns",
      cell: ({ row }) => (
        <div className="text-sm whitespace-pre-wrap max-w-[300px] line-clamp-4">
          {row.original.concerns}
        </div>
      ),
    },
    {
      accessorKey: "preferredDays",
      header: "Preferred Days",
      cell: ({ row }) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{row.original.preferredDays.days.join(", ")}</span>
        </div>
      ),
    },
    {
      accessorKey: "assignedTherapist",
      header: "Assigned Therapist",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original?.assignedTherapist ? (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">
                  {row.original?.assignedTherapist}
                </div>
                {row.original?.sessionDetails && (
                  <div className="text-sm text-muted-foreground">
                    {row.original?.sessionDetails?.day} •{" "}
                    {row.original?.sessionDetails?.startTime} -{" "}
                    {row.original?.sessionDetails?.endTime}
                  </div>
                )}
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          )}
        </div>
      ),
    },
    // {
    //   accessorKey: "assignedTherapistId",
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <Badge
    //       variant={row.original.assignedTherapistId ? "outline" : "secondary"}
    //       className={`text-xs ${
    //         row.original.assignedTherapistId
    //           ? "bg-green-50 text-green-700 border-green-200"
    //           : ""
    //       }`}
    //     >
    //       {row.original.assignedTherapistId ? "Matched" : "Pending"}
    //     </Badge>
    //   ),
    // },
  ];