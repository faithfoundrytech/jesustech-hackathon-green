import { NextResponse } from "next/server";

// Add GET method as well as POST for more flexibility
export async function GET() {
  return handleLogout();
}

export async function POST() {
  return handleLogout();
}

// Common handler for both GET and POST requests
async function handleLogout() {
  try {
    const response = NextResponse.json({
      message: "Logged out successfully"
    });
    
    // Clear the auth cookie by setting it to expire immediately
    response.cookies.set("harmony_auth_token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to epoch time (1970-01-01)
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
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