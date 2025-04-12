"use client";

import { useState } from "react";
import { Patient } from "@/types/therapist";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/patients/table-columns";
import { DocumentUpload } from "@/components/therapist-matching/DocumentUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePatients } from "@/hooks/use-patients";
import { Plus, Upload } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Sidebar } from "@/components/app/sidebar";

const navigationTabs = [
  { name: 'Dashboard', href: '/church/dashboard' },
  { name: 'Therapists', href: '/church/therapists' },
  { name: 'Patients', href: '/church/patients' },
  { name: 'Appointments', href: '/church/appointments' },
];

export default function ChurchPatients() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { patients, pagination } = usePatients(page, limit);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleUploadComplete = (_newPatients: Patient[]) => {
    setShowUploadDialog(false);
    // We could refresh patients here if needed
  };

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setShowUploadDialog(true)}>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Excel Upload
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex h-full">
      <Sidebar tabs={navigationTabs} title="Church Dashboard" />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="container mx-auto py-10">
          <div className="mt-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Patients</h1>
              <p className="text-muted-foreground">Manage and view all patients in your church</p>
            </div>
            <DataTable 
              columns={columns} 
              data={patients} 
              actions={actions} 
              title="Patients"
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
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Patient Data</DialogTitle>
              </DialogHeader>
              <DocumentUpload onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
