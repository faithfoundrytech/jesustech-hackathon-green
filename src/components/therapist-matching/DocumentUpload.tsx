import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Patient } from "@/types/therapist"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { usePatients } from "@/hooks/use-patients"

interface DocumentUploadProps {
  onUploadComplete: (patients: Patient[]) => void
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { uploadPatients, isUploading, uploadError } = usePatients()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        droppedFile.type === 'application/vnd.ms-excel')) {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Please upload an Excel file (.xlsx or .xls)')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setError(null)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      uploadPatients(jsonData, {
        onSuccess: (data) => {
          onUploadComplete(data.patients)
          setFile(null)
        },
        onError: (error) => {
          setError(error instanceof Error ? error.message : 'Failed to process file')
        }
      })
    } catch (error) {
      console.error('Error processing file:', error)
      setError(error instanceof Error ? error.message : 'Failed to process file')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Excel File</CardTitle>
        <CardDescription>
          Upload an Excel file containing patient data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-primary">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-muted-foreground">
                Excel files (.xlsx, .xls)
              </div>
            </label>
          </div>
          {file && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          {(error || uploadError) && (
            <div className="text-sm text-red-500">
              {error || (uploadError instanceof Error ? uploadError.message : 'Failed to process file')}
            </div>
          )}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 