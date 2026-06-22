
import { SubNav } from "@/components/layout/SubNav";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import Project from "@/models/Project";
import Contractor from "@/models/Contractor";
import { DroneSlider } from "@/components/dashboard/DroneSlider";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  // Fetch project by custom projectId and populate contractor
  const project = await Project.findOne({ projectId: id }).populate('contractorId', 'name contractorId overallScore').lean() as any;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-slate-50">
        <SubNav />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold text-slate-800">Project Not Found</h2>
          <Link href="/projects" className="text-brand-green mt-4 hover:underline">← Back to Projects</Link>
        </main>
      </div>
    );
  }

  const contractor = project.contractorId;
  const formattedValue = `₦${(project.budgetAllocated / 1000000000).toFixed(2)}B`;
  
  // Dummy MoF release logic for UI display (Module 7 concept)
  const amountReleased = project.budgetAllocated * 0.45; 
  const formattedReleased = `₦${(amountReleased / 1000000000).toFixed(2)}B`;
  
  // Value of work certified (correlated to physical progress)
  const valueCertified = project.budgetAllocated * (project.progressPercentage / 100);
  const formattedCertified = `₦${(valueCertified / 1000000000).toFixed(2)}B`;

  let statusClass = 'bg-emerald-100 text-emerald-700';
  if (project.status === 'Delayed' || project.status === 'At Risk') statusClass = 'bg-amber-100 text-amber-700';
  if (project.status === 'Critical') statusClass = 'bg-red-100 text-red-700';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <SubNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="mb-6">
          <Link href="/projects" className="text-brand-green hover:underline text-sm font-medium flex items-center mb-4">
            ← Back to Projects
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{project.projectId}: {project.title}</h2>
              <p className="text-slate-500 mt-1">Comprehensive view of project milestones, financials, and drone verification.</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`${statusClass} px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider mb-2`}>
                {project.status}
              </span>
              <span className="text-xl font-bold text-slate-800">{project.progressPercentage}% Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Overview</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Contractor</span>
                    {contractor ? (
                      <Link href={`/contractors/${contractor.contractorId}`} className="font-medium text-brand-green hover:underline">
                        {contractor.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-slate-800">Unassigned</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Sector</span>
                    <span className="font-medium text-slate-800">{project.sector}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">LGA</span>
                    <span className="font-medium text-slate-800">{project.lga}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Contract Sum</span>
                    <span className="font-bold text-slate-800 text-lg">{formattedValue}</span>
                  </div>
               </div>
             </div>

             {/* Module 5: Drone Progress Slider */}
             <DroneSlider 
                beforeImage="https://images.unsplash.com/photo-1541888081696-29177119ff3d?auto=format&fit=crop&q=80&w=1000" // Earthworks placeholder
                afterImage="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1000" // Paved road placeholder
                beforeLabel="Month 1 (Baseline)"
                afterLabel="Latest Scan"
             />

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                 <h3 className="font-bold text-slate-800">Field Verification Reports</h3>
                 <Link href="/field-report" className="text-xs bg-brand-green hover:bg-emerald-600 text-white px-3 py-1.5 rounded font-medium transition-colors">
                    + Add Report
                 </Link>
               </div>
               <div className="text-sm text-slate-500 italic p-4 text-center">
                 No field reports submitted for this project yet. Use the mobile app to capture verified data.
               </div>
             </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
             {/* Module 7: Budget vs Delivery */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Financial Summary (Module 7)</h3>
                <div className="space-y-4 text-sm">
                   <div className="flex justify-between items-center">
                      <span className="text-slate-500">Budget Allocated</span>
                      <span className="font-medium text-slate-800">{formattedValue}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-500">Amount Released (MoF)</span>
                      <span className="font-medium text-slate-800">{formattedReleased}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-500">Value of Work Certified</span>
                      <span className="font-medium text-status-green">{formattedCertified}</span>
                   </div>
                   
                   <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-semibold text-slate-700">Financial vs Physical Variance</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                         <div className="bg-brand-green h-2 rounded-full" style={{ width: `${project.progressPercentage}%` }}></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Physical Completion vs Expected Financial Burn</p>
                   </div>
                </div>
             </div>

             {/* Module 6: Predictive Risk Preview */}
             <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 text-white">
                <div className="flex items-center space-x-2 mb-4 border-b border-slate-600 pb-2">
                   <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                   <h3 className="font-bold">AI Risk Engine (Module 6)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-400">Contractor Reliability</span>
                     <span className={contractor?.overallScore > 75 ? 'text-emerald-400' : 'text-amber-400'}>
                       {contractor?.overallScore}/100
                     </span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Likelihood of Delay</span>
                     <span className={project.status === 'On Track' ? 'text-emerald-400' : 'text-red-400'}>
                       {project.status === 'On Track' ? 'Low (12%)' : 'High (84%)'}
                     </span>
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
