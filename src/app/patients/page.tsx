"use client";

import { useState } from "react";
import { Patient } from "@/types/therapist";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../../components/patients/table-columns";
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

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { patients, pagination, isLoading, error } = usePatients(page, limit);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleAddPatient = () => {
    const newPatient: Patient = {
      id: patients.length + 1,
      name: "New Patient",
      age: 0,
      gender: "Not Specified",
      concerns: "Not Specified",
      preferredDays: {
        days: [],
        timeSlots: [],
      },
    };

    // TODO: Implement add patient mutation
    console.log('Add patient:', newPatient);
  };

  const handleUploadComplete = (newPatients: Patient[]) => {
    setShowUploadDialog(false);
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
        <DropdownMenuItem onClick={handleAddPatient}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Excel Upload
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="container mx-auto py-10">
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
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Patient Data</DialogTitle>
          </DialogHeader>
          <DocumentUpload onUploadComplete={handleUploadComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
