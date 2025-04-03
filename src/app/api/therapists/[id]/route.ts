import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Therapist from "@/models/therapist";
import { generateTherapistEmbedding } from "@/utils/therapist-embeddings";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    const therapist = await Therapist.findById(id);
    
    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(therapist);
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapist" },
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
    
    const therapist = await Therapist.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    
    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    // Generate new embedding for the updated therapist
    const embedding = await generateTherapistEmbedding(therapist);

    // Update the therapist with the new embedding
    const updatedTherapist = await Therapist.findByIdAndUpdate(
      id,
      { $set: { embedding } },
      { new: true }
    );

    return NextResponse.json(updatedTherapist);
  } catch (error) {
    console.error("Error updating therapist:", error);
    return NextResponse.json(
      { error: "Failed to update therapist" },
      { status: 500 }
    );
  }
} 