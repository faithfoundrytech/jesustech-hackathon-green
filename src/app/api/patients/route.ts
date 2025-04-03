import { NextResponse } from "next/server";
import connectDB  from "@/lib/mongodb";
import Patient from "@/models/patient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patients } = body;

    if (!Array.isArray(patients)) {
      return NextResponse.json(
        { error: "Patients data must be an array" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create patients in bulk
    const createdPatients = await Patient.insertMany(patients);

    return NextResponse.json(
      { message: "Patients created successfully", patients: createdPatients },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating patients:", error);
    return NextResponse.json(
      { error: "Failed to create patients" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Patient.countDocuments({});

    // Get paginated patients
    const patients = await Patient.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      data: patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
} 