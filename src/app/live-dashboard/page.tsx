"use client";

import { SubNav } from "@/components/layout/SubNav";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/dashboard/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
      Loading map...
    </div>
  ),
});

export default function LiveDashboardPage() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans bg-slate-50">
      <SubNav />

      <main className="flex-1 w-full p-4 md:p-6 flex flex-col min-h-0 gap-6">
        <div className="flex-1 rounded-xl h-full relative bg-white shadow-sm border border-slate-200 p-2">
          <MapComponent />
        </div>
      </main>
    </div>
  );
}
