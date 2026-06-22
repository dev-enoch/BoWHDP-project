
import { SubNav } from "@/components/layout/SubNav";
import Link from "next/link";

export default async function ContractorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">

      <SubNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="mb-6">
          <Link href="/contractors" className="text-brand-green hover:underline text-sm font-medium flex items-center mb-4">
            ← Back to Directory
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Contractor Profile: {id}</h2>
              <p className="text-slate-500 mt-1">Detailed performance history and active projects.</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider">Active Status</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Company Information</h3>
              <ul className="space-y-3 text-sm">
                <li><span className="text-slate-500 block">Registered Name</span><span className="font-semibold text-slate-800">Sample Contractor Ltd</span></li>
                <li><span className="text-slate-500 block">Registration Date</span><span className="font-medium text-slate-800">14 Aug 2021</span></li>
                <li><span className="text-slate-500 block">Contact Email</span><span className="font-medium text-slate-800">contact@samplecontractor.com.ng</span></li>
                <li><span className="text-slate-500 block">Head Office</span><span className="font-medium text-slate-800">Maiduguri, Borno State</span></li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Scorecard Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Timeliness (35%)</span>
                    <span className="font-semibold">88/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-brand-green h-2 rounded-full" style={{ width: '88%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Quality (35%)</span>
                    <span className="font-semibold">92/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-brand-green h-2 rounded-full" style={{ width: '92%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Responsiveness (15%)</span>
                    <span className="font-semibold">85/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-brand-green h-2 rounded-full" style={{ width: '85%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Citizen Complaints (15%)</span>
                    <span className="font-semibold text-status-green">Minimal (90/100)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-brand-green h-2 rounded-full" style={{ width: '90%' }}></div></div>
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center text-lg">
                  <span className="text-slate-600 font-semibold">Overall Composite</span>
                  <span className="font-bold text-status-green">89.4%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Assigned Projects</h3>
               <div className="space-y-4">
                  <div className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                       <Link href="/projects/PRJ-001" className="font-semibold text-brand-green hover:underline">Bama-Banki Road Rehabilitation</Link>
                       <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">On Track</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">Roads Sector • ₦4.2B • Bama LGA</p>
                    <div className="flex items-center space-x-3 text-sm">
                       <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div className="bg-status-green h-2 rounded-full" style={{ width: '78%' }}></div>
                       </div>
                       <span className="font-medium text-slate-600">78% Complete</span>
                    </div>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                       <Link href="/projects/PRJ-009" className="font-semibold text-brand-green hover:underline">State Secretariat Annex</Link>
                       <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">Completed</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">Buildings Sector • ₦1.8B • Maiduguri LGA</p>
                    <div className="flex items-center space-x-3 text-sm">
                       <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div className="bg-status-green h-2 rounded-full" style={{ width: '100%' }}></div>
                       </div>
                       <span className="font-medium text-slate-600">100% Complete</span>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 mt-auto bg-white text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-8">
          Powered by Haigha Technology · Secure · ISO-aligned · Built for Borno
        </div>
      </footer>
    </div>
  );
}
