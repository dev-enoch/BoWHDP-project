import React from 'react';

interface KPICardProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: string;
}

function KPICard({ label, value, subValue, highlight }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
      <div className="text-3xl font-bold text-brand-green mb-1">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">{label}</div>
      {subValue && <div className="text-sm text-slate-500 mt-2">{subValue}</div>}
    </div>
  );
}

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function KPIWidgets() {
  const { data } = useSWR('/api/projects', fetcher);
  const projects = data?.projects || [];

  const totalProjects = projects.length;
  const onTrackProjects = projects.filter((p: any) => p.status === 'On Track').length;
  const onTrackPercentage = totalProjects > 0 ? Math.round((onTrackProjects / totalProjects) * 100) : 0;
  
  const totalBudget = projects.reduce((acc: number, p: any) => acc + (p.budgetAllocated || 0), 0);
  const formattedBudget = `₦${(totalBudget / 1000000000).toFixed(1)}B`;

  const atRiskCount = projects.filter((p: any) => p.status === 'Delayed' || p.status === 'At Risk' || p.status === 'Critical').length;
  return (
    <div className="grid grid-cols-4 gap-6">
      <KPICard label="Total Projects" value={totalProjects.toString()} />
      <KPICard label="On Track" value={`${onTrackPercentage}%`} />
      <KPICard label="Portfolio" value={formattedBudget} />
      <KPICard label="At Risk / Delayed" value={atRiskCount.toString()} />
    </div>
  );
}
