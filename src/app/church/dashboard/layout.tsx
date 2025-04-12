"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  churchName: string;
  email: string;
  role: string;
}

export default function ChurchDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, let the middleware handle it
            return;
          }
          throw new Error("Error fetching user data");
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/church/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <header className="border-b border-border">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="text-primary text-xl font-semibold">
                  {user.churchName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="font-medium">{user.churchName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign Out
            </button>
          </div>
        </header>
      )}
      {children}
    </div>
  );
} 