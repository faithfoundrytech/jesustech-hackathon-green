"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChurch, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ChurchRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission initiated");
    
    try {
      // Form validation
      if (!formData.organizationName.trim()) {
        toast.error("Organization name is required");
        return;
      }
      
      if (!formData.email.trim()) {
        toast.error("Email is required");
        return;
      }
      
      if (!formData.password.trim()) {
        toast.error("Password is required");
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      
      // Show a test toast to verify it's working
      toast.info("Validations passed. Submitting form...");
      
      setIsLoading(true);
      
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword: _, ...registerData } = formData;
      console.log("Register data:", registerData);
      
      // Make API request
      console.log("Sending request to /api/church/register");
      const response = await fetch("/api/church/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
      
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        const errorMessage = data.error || "Registration failed";
        console.error("API error:", errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      // Success toast and redirect
      toast.success("Registration successful");
      router.push("/church/login");
    } catch (error) {
      console.error("Registration error:", error);
      
      // Show explicit error message
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Welcome message */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-primary/10 rounded-2xl backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaChurch className="text-4xl text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Join Harmony</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Register your church and start supporting your community&apos;s mental health journey.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-muted-foreground">Create your church profile</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-muted-foreground">Access professional resources</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-muted-foreground">Connect with mental health professionals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Registration form */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create Your Church Account</CardTitle>
              <CardDescription>Join our community of faith-based mental health support</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Church Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaChurch className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required
                      placeholder="Church Name"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Church Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      required
                      placeholder="Church Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href="/church/login"
                    className="font-medium text-primary hover:text-primary/90 transition-colors duration-200"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 