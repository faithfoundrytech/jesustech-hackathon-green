"use client";

import { FaUsers, FaUserMd, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { Sidebar } from "@/components/app/sidebar";

const navigationTabs = [
  { name: 'Dashboard', href: '/church/dashboard' },
  { name: 'Therapists', href: '/church/therapists' },
  { name: 'Patients', href: '/church/patients' },
  { name: 'Appointments', href: '/church/appointments' },
];

export default function ChurchDashboard() {
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
                  <h3 className="text-2xl font-bold text-foreground">1,234</h3>
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
                  <h3 className="text-2xl font-bold text-foreground">45</h3>
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
                  <h3 className="text-2xl font-bold text-foreground">28</h3>
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
                  <h3 className="text-2xl font-bold text-foreground">92%</h3>
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
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Dr. Sarah Johnson</td>
                      <td className="py-3 px-4">Clinical Psychology</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Dr. Michael Brown</td>
                      <td className="py-3 px-4">Family Therapy</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Dr. Emily Davis</td>
                      <td className="py-3 px-4">Child Psychology</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">On Leave</span>
                      </td>
                    </tr>
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
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">John Smith</td>
                      <td className="py-3 px-4">Dr. Sarah Johnson</td>
                      <td className="py-3 px-4">2 days ago</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Mary Wilson</td>
                      <td className="py-3 px-4">Dr. Michael Brown</td>
                      <td className="py-3 px-4">3 days ago</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">David Lee</td>
                      <td className="py-3 px-4">Dr. Emily Davis</td>
                      <td className="py-3 px-4">1 week ago</td>
                    </tr>
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