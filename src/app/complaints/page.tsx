"use client";

import { SubNav } from "@/components/layout/SubNav";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from "react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export default function ComplaintsInbox() {
  const queryClient = useQueryClient();
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => fetcher('/api/complaints')
  });
  const complaints = data?.complaints || [];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <SubNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Citizen Feedback Inbox</h2>
            <p className="text-slate-500 mt-1">Review and assign incoming complaints from USSD and WhatsApp channels.</p>
          </div>
          <button className="bg-brand-green text-white px-4 py-2 rounded-md font-medium hover:bg-brand-dark transition-colors">
            Generate Feedback Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Complaint ID</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Citizen Phone</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">SLA Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 animate-pulse">Loading inbox...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-red-500">Failed to load complaints.</td>
                  </tr>
                )}
                {complaints.length === 0 && !isLoading && !error && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No complaints in the inbox.</td>
                  </tr>
                )}
                {complaints.map((c: any) => {
                  const deadline = new Date(c.slaDeadline);
                  const isOverdue = deadline < new Date() && c.status !== 'Resolved';
                  
                  return (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{c.complaintId}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">{c.source}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">{c.citizenPhone}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600" title={c.message}>{c.message}</td>
                      <td className={`px-6 py-4 font-medium ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {deadline.toLocaleString()}
                        {isOverdue && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">OVERDUE</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'Open' ? 'bg-amber-100 text-amber-700' : 
                          c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-brand-green hover:underline font-medium text-xs">Assign</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
