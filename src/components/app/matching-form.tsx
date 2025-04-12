"use client"

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const MatchingForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    membershipStatus: "",
    challenges: "",
    genderPreference: "",
    weekdays: false,
    evenings: false,
    weekends: false,
    preferences: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData({ ...formData, [id]: checked });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create availability object
      const days = [];
      if (formData.weekdays) days.push('weekday');
      if (formData.evenings) days.push('evening');
      if (formData.weekends) days.push('weekend');
      
      // Create patient object
      const patientData = {
        name: formData.name || 'Anonymous',
        age: parseInt(formData.age) || 30, // Default to 30 if not provided
        gender: formData.gender || 'not_specified',
        email: formData.email,
        phone: formData.phone,
        church: formData.membershipStatus === 'yes' ? 'member' : 'visitor',
        maritalStatus: 'not_specified', // Default value
        concerns: formData.challenges || formData.preferences || 'General counseling',
        preferredDays: {
          days: days.length > 0 ? days : ['weekday'], // Default to weekday if none selected
          timeSlots: [{
            start: '09:00',
            end: '17:00'
          }]
        }
      };
      
      // Submit to API
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patients: [patientData] }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create patient');
      }
      
      // Success
      setFormSubmitted(true);
      console.log("Patient created successfully");
    } catch (err) {
      setError((err as Error).message);
      console.error("Error creating patient:", err);
    } finally {
      setLoading(false);
    }
  };
  
  if (formSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <CardTitle className="text-2xl font-merriweather font-bold mb-4 text-foreground">
            Thank You For Trusting Us
          </CardTitle>
          <p className="text-foreground mb-6">
            A licensed counselor will reach out within 24 hours. Your journey to healing begins now.
          </p>
          <Button
            variant="link"
            onClick={() => setFormSubmitted(false)}
            className="text-primary"
          >
            Return to form
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card id="matching-form" className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-merriweather font-bold text-center text-foreground">
          Get Matched With a Counselor
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Name (optional)
            </Label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age" className="text-foreground">
              Age (optional)
            </Label>
            <Input
              type="number"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-foreground">
              Gender (optional)
            </Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled>Please select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
              <option value="not_specified">Prefer not to say</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="membershipStatus" className="text-foreground">
              Are you a church member? <span className="text-destructive">*</span>
            </Label>
            <select
              id="membershipStatus"
              required
              value={formData.membershipStatus}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled>Please select...</option>
              <option value="yes">Yes, I&apos;m a member</option>
              <option value="no">No, I&apos;m new here</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="challenges" className="text-foreground">
              What challenges are you facing? <span className="text-destructive">*</span>
            </Label>
            <select
              id="challenges"
              required
              value={formData.challenges}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled>Please select...</option>
              <option value="anxiety">Anxiety</option>
              <option value="grief">Grief</option>
              <option value="marriage">Marriage</option>
              <option value="parenting">Parenting</option>
              <option value="depression">Depression</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genderPreference" className="text-foreground">
              Preferred Counselor Gender (optional)
            </Label>
            <select
              id="genderPreference"
              value={formData.genderPreference}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled>Please select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="no-preference">No Preference</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-foreground">Availability</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="weekdays" 
                  checked={formData.weekdays}
                  onCheckedChange={(checked) => handleCheckboxChange("weekdays", checked as boolean)} 
                />
                <label htmlFor="weekdays" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Weekdays
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="evenings" 
                  checked={formData.evenings}
                  onCheckedChange={(checked) => handleCheckboxChange("evenings", checked as boolean)}
                />
                <label htmlFor="evenings" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Evenings
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="weekends" 
                  checked={formData.weekends}
                  onCheckedChange={(checked) => handleCheckboxChange("weekends", checked as boolean)}
                />
                <label htmlFor="weekends" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Weekends
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferences" className="text-foreground">
              Any faith-based preferences for counseling? (optional)
            </Label>
            <Textarea
              id="preferences"
              rows={3}
              value={formData.preferences}
              onChange={handleChange}
              className="w-full border-border focus:ring-primary"
            />
          </div>
          
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Submitting..." : "Submit & Get Matched"}
            </Button>
            <p className="text-xs text-center mt-2 text-foreground opacity-80">
              By submitting, you agree to our privacy policy.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MatchingForm;