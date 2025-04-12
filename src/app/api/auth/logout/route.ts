import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logged out successfully"
    });
    
    // Clear the auth cookie by setting it to expire immediately
    response.cookies.set("harmony_auth_token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to epoch time (1970-01-01)
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
} 