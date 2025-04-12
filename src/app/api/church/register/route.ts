import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { hash } from "bcrypt";
import Organization from "@/models/organization";

// Define schema for validation
const organizationSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(req: Request) {
  console.log("API: Registration request received");
  try {
    // Connect to the database first (like other routes)
    await connectDB();
    console.log("API: Database connected");
    
    // Parse request body
    const body = await req.json();
    console.log("API: Request body parsed");
    
    // Map churchName to organizationName if needed
    const requestData = {
      ...body,
      organizationName: body.churchName || body.organizationName,
    };
    
    // Remove churchName if it exists to avoid validation errors
    if (requestData.churchName && !requestData.organizationName) {
      delete requestData.churchName;
    }
    
    // Validate request data
    const validation = organizationSchema.safeParse(requestData);
    if (!validation.success) {
      console.log("API: Validation failed:", validation.error.errors);
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { organizationName, email, password, phone, address } = validation.data;
    
    // Check if organization with this email already exists
    const existingOrganization = await Organization.findOne({ email });
    if (existingOrganization) {
      console.log("API: Organization with this email already exists");
      return NextResponse.json(
        { error: "An organization with this email already exists" },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 12);
    
    // Create and save the organization
    const organization = await Organization.create({
      organizationName,
      email,
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
    });
    
    console.log("API: Organization created with ID:", organization._id);
    
    // Return success response
    return NextResponse.json(
      { 
        message: "Organization registered successfully",
        organizationId: organization._id
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API: Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Registration failed", details: errorMessage },
      { status: 500 }
    );
  }
} 