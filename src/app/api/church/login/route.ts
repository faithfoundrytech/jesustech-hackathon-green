import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { compare } from "bcrypt";
import { signToken } from "@/lib/auth";
import Organization from "@/models/organization";

// Define schema for validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  console.log("API: Login request received");
  try {
    // Connect to the database first (like other routes)
    await connectDB();
    console.log("API: Database connected");
    
    // Parse request body
    const body = await req.json();
    
    // Validate request data
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { email, password } = validationResult.data;
    
    // Find the organization by email
    const organization = await Organization.findOne({ email }).lean();
    if (!organization) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Compare passwords
    const passwordMatch = await compare(password, organization.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Create JWT token using our auth library
    const token = await signToken({
      id: organization._id.toString(),
      email: organization.email,
      role: organization.role,
    });
    
    if (!token) {
      return NextResponse.json(
        { error: "Failed to create authentication token" },
        { status: 500 }
      );
    }
    
    // Create response with cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: organization._id,
        churchName: organization.organizationName, // Return as churchName for client
        email: organization.email,
        role: organization.role,
      },
    });
    
    // Set cookie directly on the response
    response.cookies.set("harmony_auth_token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response;
  } catch (error: unknown) {
    console.error("API: Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Login failed", details: errorMessage },
      { status: 500 }
    );
  }
} 