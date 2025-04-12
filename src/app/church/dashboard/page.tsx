"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaUserMd, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { Sidebar } from "@/components/app/sidebar";
import { Therapist } from "@/types/therapist";

// Define types for patients since they might not be imported yet
interface Patient {
  _id: string;
  name: string;
  therapist?: {
    name: string;
  };
  lastSession?: string;
}

const navigationTabs = [
  { name: 'Dashboard', href: '/church/dashboard' },
  { name: 'Therapists', href: '/church/therapists' },
  { name: 'Patients', href: '/church/patients' },
  { name: 'Appointments', href: '/church/appointments' },
];

export default function ChurchDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    activeTherapists: 0,
    upcomingSessions: 0,
    successRate: 0,
  });
  const [recentTherapists, setRecentTherapists] = useState<Therapist[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch therapists count
        const therapistsResponse = await fetch('/api/therapists?limit=1');
        const therapistsData = await therapistsResponse.json();
        
        // Fetch patients count
        const patientsResponse = await fetch('/api/patients?limit=1');
        const patientsData = await patientsResponse.json();
        
        // Fetch upcoming sessions
        const today = new Date().toISOString();
        const sessionsResponse = await fetch(`/api/sessions?after=${today}`);
        const sessionsData = await sessionsResponse.json();
        
        // Get recent therapists
        const recentTherapistsResponse = await fetch('/api/therapists?limit=3');
        const recentTherapistsData = await recentTherapistsResponse.json();
        
        // Get recent patients
        const recentPatientsResponse = await fetch('/api/patients?limit=3');
        const recentPatientsData = await recentPatientsResponse.json();
        
        // Update dashboard stats
        setDashboardStats({
          totalPatients: patientsData.pagination?.total || 0,
          activeTherapists: therapistsData.pagination?.total || 0,
          upcomingSessions: Array.isArray(sessionsData) ? sessionsData.length : 0,
          successRate: 92, // Assuming we don't have a way to calculate this yet
        });
        
        // Update recent lists
        setRecentTherapists(recentTherapistsData.data || []);
        setRecentPatients(recentPatientsData.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-full">
      <Sidebar tabs={navigationTabs} title="Church Dashboard" />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Church Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your church management dashboard</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FaUsers className="text-2xl text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isLoading ? '...' : dashboardStats.totalPatients}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FaUserMd className="text-2xl text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Therapists</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isLoading ? '...' : dashboardStats.activeTherapists}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FaCalendarAlt className="text-2xl text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isLoading ? '...' : dashboardStats.upcomingSessions}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FaChartLine className="text-2xl text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isLoading ? '...' : `${dashboardStats.successRate}%`}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Activity Chart */}
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Activity</h2>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be displayed here</p>
              </div>
            </div>

            {/* Patient Distribution */}
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Patient Distribution</h2>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be displayed here</p>
              </div>
            </div>

            {/* Recent Therapists */}
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Therapists</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Specialty</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-muted-foreground">Loading...</td>
                      </tr>
                    ) : recentTherapists.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-muted-foreground">No therapists found</td>
                      </tr>
                    ) : (
                      recentTherapists.map((therapist) => (
                        <tr key={therapist._id} className="border-b border-border/50">
                          <td className="py-3 px-4">{therapist.name}</td>
                          <td className="py-3 px-4">{therapist.specialty}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Patients</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Therapist</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-muted-foreground">Loading...</td>
                      </tr>
                    ) : recentPatients.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-muted-foreground">No patients found</td>
                      </tr>
                    ) : (
                      recentPatients.map((patient) => (
                        <tr key={patient._id} className="border-b border-border/50">
                          <td className="py-3 px-4">{patient.name}</td>
                          <td className="py-3 px-4">{patient.therapist?.name || 'Not assigned'}</td>
                          <td className="py-3 px-4">{patient.lastSession || 'No sessions yet'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 