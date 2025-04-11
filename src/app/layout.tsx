import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/app/sidebar";
import { QueryProvider } from "@/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harmony - Therapy Management",
  description: "A comprehensive therapy management system",
};

const navigationTabs = [
  { name: 'Patients', href: '/patients' },
  { name: 'Therapists', href: '/therapists' },
  { name: 'Sessions', href: '/sessions' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <QueryProvider>
          <div className="flex h-full bg-slate-50 dark:bg-slate-900">
            <Sidebar tabs={navigationTabs} title="Nairobi Chapel" />
            <main className="flex-1 lg:ml-64 overflow-auto">
              <div className="h-full">
                {children}
              </div>
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
