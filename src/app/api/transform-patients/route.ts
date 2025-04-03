import { NextResponse } from "next/server"
import { transformExcelToPatientsWithLLM } from "@/utils/excel-to-patients-langchain"
import { generatePatientEmbeddings } from "@/utils/patient-embeddings"
import connectDB from "@/lib/mongodb"
import Patient from "@/models/patient"  

export async function POST(request: Request) {
  try {
    const { data } = await request.json()
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Data must be an array" },
        { status: 400 }
      )
    }
    const processedPatients = await transformExcelToPatientsWithLLM(data)
    
    await connectDB()

    // First, insert/update patients without embeddings
    const upsertPromises = processedPatients.map(patient => 
      Patient.findOneAndUpdate(
        { email: patient.email },
        patient,
        { upsert: true, new: true }
      )
    )

    const results = await Promise.all(upsertPromises)
    const createdCount = results.filter(r => r.isNew).length
    const updatedCount = results.length - createdCount

    // Generate embeddings for all patients
    const embeddings = await generatePatientEmbeddings(results)

    // Update patients with their embeddings
    const updateEmbeddingPromises = results.map(patient => {
      const embedding = embeddings.get(patient._id)
      if (embedding) {
        return Patient.findByIdAndUpdate(
          patient._id,
          { embedding },
          { new: true }
        )
      }
      return patient
    })

    const updatedPatients = await Promise.all(updateEmbeddingPromises)

    return NextResponse.json({ 
      patients: updatedPatients,
      totalProcessed: updatedPatients.length,
      created: createdCount,
      updated: updatedCount,
      message: `Successfully processed ${updatedPatients.length} patients (${createdCount} created, ${updatedCount} updated) with embeddings`
    })
  } catch (error) {
    console.error("Error in LangChain API:", error)
    return NextResponse.json(
      { 
        error: "Failed to process data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 