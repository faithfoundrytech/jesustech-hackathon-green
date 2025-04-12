import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Organization from "@/models/organization";

export async function GET() {
  try {
    // Verify the auth token
    const payload = await verifyAuth();
    
    if (!payload) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Connect to DB and fetch user data
    await connectDB();
    
    // Find the user by ID
    const userId = typeof payload.id === 'string' ? payload.id : String(payload.id);
    const user = await Organization.findById(userId).select("-password").lean();
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Return user data (with organizationName mapped to churchName for UI)
    return NextResponse.json({
      user: {
        id: user._id,
        churchName: user.organizationName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
} 