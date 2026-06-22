
import { SubNav } from "@/components/layout/SubNav";

const DUMMY_REPORTS = [
  { id: "REP-01", title: "Q1 2026 Public Delivery Report", date: "April 5, 2026", status: "Published", lgasCovered: 27 },
  { id: "REP-02", title: "Q4 2025 Public Delivery Report", date: "January 10, 2026", status: "Published", lgasCovered: 27 },
  { id: "REP-03", title: "Special Report: Maiduguri Flood Recovery", date: "November 22, 2025", status: "Archived", lgasCovered: 4 },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <SubNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Quarterly Public Reports</h2>
          <p className="text-slate-500 mt-1">Generate and view automated delivery reports for public and executive distribution.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg text-slate-800 mb-4">Past Reports</h3>
            {DUMMY_REPORTS.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex justify-between items-center hover:border-brand-green transition-colors cursor-pointer group">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-100 p-3 rounded-lg text-slate-500 group-hover:bg-emerald-50 group-hover:text-brand-green transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{report.title}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">Published: {report.date} • {report.lgasCovered} LGAs Covered</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${report.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{report.status}</span>
                  <button className="text-brand-green hover:underline text-sm font-medium">Download PDF</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-brand-dark rounded-xl shadow-md p-6 text-white text-center">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Generate New Report</h3>
              <p className="text-brand-green-100 text-sm mb-6 opacity-90">Compile latest data from all 27 LGAs into an executive-ready PDF.</p>
              <button className="w-full bg-white text-brand-dark px-4 py-3 rounded-md font-bold hover:bg-slate-100 transition-colors shadow-sm">
                Run Generation (Q2 2026)
              </button>
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
