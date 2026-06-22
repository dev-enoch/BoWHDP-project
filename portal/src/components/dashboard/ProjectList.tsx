import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ProjectList() {
  const { data, error, isLoading } = useSWR('/api/projects', fetcher);

  if (isLoading) return <div className="text-slate-500 text-sm p-4 animate-pulse">Loading live projects...</div>;
  if (error) return <div className="text-red-500 text-sm p-4">Failed to load projects</div>;

  const projects = data?.projects || [];

  return (
    <div className="flex flex-col space-y-4">
      {projects.map((project: any) => {
        let colorClass = 'bg-status-green';
        if (project.status === 'Delayed' || project.status === 'At Risk') colorClass = 'bg-status-amber';
        if (project.status === 'Critical') colorClass = 'bg-status-red';

        return (
          <div key={project._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-end mb-2">
              <span className="font-semibold text-slate-800">{project.projectId} - {project.title}</span>
            </div>
            <div className="text-xs text-slate-500 mb-1">{project.lga} LGA • {project.sector}</div>
            <div className="text-xs text-slate-500 mb-3">{project.progressPercentage}% complete</div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={`${colorClass} h-2 rounded-full`}
                style={{ width: `${project.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
