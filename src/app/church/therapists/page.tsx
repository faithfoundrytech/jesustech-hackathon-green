"use client";

import { Therapist } from "@/types/therapist";
import { useTherapists } from "@/hooks/use-therapists";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, GraduationCap, Plus, ExternalLink } from "lucide-react";
import { useState } from "react";
import { AddTherapistModal } from "@/components/therapist/add-therapist-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
import { Sidebar } from "@/components/app/sidebar";

const navigationTabs = [
  { name: 'Dashboard', href: '/church/dashboard' },
  { name: 'Therapists', href: '/church/therapists' },
  { name: 'Patients', href: '/church/patients' },
  { name: 'Appointments', href: '/church/appointments' },
];

export default function TherapistsPage() {
  const [addTherapistModal, setAddTherapistModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { therapists, pagination } = useTherapists({ page, limit });
  
  const actions = (
    <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => setAddTherapistModal(true)}>
      <Plus className="mr-2 h-4 w-4" />
      Add Therapist
    </Button>
  );

  const columns: ColumnDef<Therapist>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div>
            <Link 
              href={`/church/therapists/${row.original._id}`}
              className="font-medium hover:underline flex items-center gap-2"
            >
              {row.original.name}
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
            <div className="text-sm text-muted-foreground">
              {row.original.experience} • {row.original.specialty}
            </div>
          </div>
        </div>
      )
    },
    {
      accessorKey: "bio",
      header: "Bio",
      cell: ({ row }) => (
        <div className="text-sm whitespace-pre-wrap max-w-[300px] line-clamp-4">
          {row.original.bio}
        </div>
      ),
    },
    {
      accessorKey: "education",
      header: "Education",
      cell: ({ row }) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <GraduationCap className="mr-1 h-4 w-4" />
          <span>{row.original.education}</span>
        </div>
      )
    },
    {
      accessorKey: "availability",
      header: "Availability",
      cell: ({ row }) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{row.original.availability.days.join(", ")}</span>
        </div>
      )
    },
    {
      accessorKey: "languages",
      header: "Languages",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.languages.map((lang) => (
            <Badge key={lang} variant="secondary">
              {lang}
            </Badge>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="flex h-full">
      <Sidebar tabs={navigationTabs} title="Church Dashboard" />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="container mx-auto py-10">
          <div className="mt-8">
            <DataTable 
              columns={columns} 
              data={therapists} 
              searchKey="name"
              searchPlaceholder="Search therapists..."
              title="Therapists"
              actions={actions}
            />
            {pagination && (
              <div className="mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
          <AddTherapistModal
            open={addTherapistModal}
            setOpen={setAddTherapistModal}
          />
        </div>
      </main>
    </div>
  );
} 