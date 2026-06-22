"use client";

import { SubNav } from "@/components/layout/SubNav";
import { KPIWidgets } from "@/components/dashboard/KPIWidgets";
import { ProjectList } from "@/components/dashboard/ProjectList";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/dashboard/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
      Loading map...
    </div>
  ),
});

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SubNav />

      <div className="mb-10 text-center space-y-3 bg-green-100 py-9">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Every Project. Every Naira. Every LGA. Tracked.
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto">
            Real-time delivery intelligence for the Commissioner's office
          </p>
          <Link href="/live-dashboard" className="mt-4 bg-[#2e9c5f] hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-md transition-colors flex items-center mx-auto space-x-2 w-max">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
               <path d="M8 5v14l11-7z" />
            </svg>
            <span>Open Live Dashboard</span>
          </Link>
        </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <KPIWidgets />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-xl h-[500px]">
            <MapComponent />
          </div>
          <div className="flex flex-col h-[500px] overflow-y-auto pr-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Live Project Feed</h3>
            <div className="overflow-y-auto flex-1 pr-2">
               <ProjectList />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 mt-12 bg-white text-center text-sm text-slate-500">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <span>Powered by Haigha Technology · Secure · ISO-aligned · Built for Borno</span>
        </div>
      </footer>
    </div>
  );
}
