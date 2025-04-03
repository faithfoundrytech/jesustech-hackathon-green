import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Patient from "@/models/patient";
import { generatePatientEmbedding } from "@/utils/patient-embeddings";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    const patient = await Patient.findById(id);
    
    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const data = await request.json();
    
    const patient = await Patient.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    
    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Generate new embedding for the updated patient
    const embedding = await generatePatientEmbedding(patient);

    // Update the patient with the new embedding
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: { embedding } },
      { new: true }
    );

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
} 