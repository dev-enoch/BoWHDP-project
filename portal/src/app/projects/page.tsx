"use client";

import { SubNav } from "@/components/layout/SubNav";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Plus, X } from 'lucide-react';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = {
    title: '', lga: '', sector: 'Road', status: 'On Track', 
    budgetAllocated: '', startDate: '', estimatedCompletion: '', contractorId: '', progressPercentage: 0
  };
  const [formData, setFormData] = useState(initialFormState);

  const { data, error, isLoading } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetcher(`/api/projects?page=${page}&limit=5`)
  });

  // Fetch contractors for the dropdown
  const { data: contractorsData } = useQuery({
    queryKey: ['contractors', 'all'],
    queryFn: () => fetcher(`/api/contractors?limit=100`)
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: any) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProject, coordinates: [11.8333, 13.1500] })
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowModal(false);
      setFormData(initialFormState);
    }
  });

  const editMutation = useMutation({
    mutationFn: async (updatedProject: any) => {
      const res = await fetch(`/api/projects/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject)
      });
      if (!res.ok) throw new Error('Failed to update project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowEditModal(false);
      setFormData(initialFormState);
      setEditingId(null);
    }
  });

  const openEditModal = (project: any) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      lga: project.lga,
      sector: project.sector,
      status: project.status,
      budgetAllocated: project.budgetAllocated,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      estimatedCompletion: project.estimatedCompletion ? new Date(project.estimatedCompletion).toISOString().split('T')[0] : '',
      contractorId: project.contractorId?._id || project.contractorId || '',
      progressPercentage: project.progressPercentage || 0
    });
    setShowEditModal(true);
  };

  
  const projects = data?.projects || [];
  const totalPages = data?.totalPages || 1;
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <SubNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Project Portfolio</h2>
            <p className="text-slate-500 mt-1">Manage and view details for all active and completed infrastructure projects.</p>
          </div>
          <button className="bg-brand-green text-white px-4 py-2 rounded-md font-medium hover:bg-brand-dark transition-colors">
            + New Project
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Project ID</th>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">LGA</th>
                  <th className="px-6 py-4">Sector</th>
                  <th className="px-6 py-4">Contractor</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                  {user?.role === 'Admin' && <th className="px-6 py-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500 animate-pulse">Loading live projects...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-red-500">Failed to load projects.</td>
                  </tr>
                )}
                {projects.map((project: any) => {
                  let statusClass = 'bg-emerald-100 text-emerald-700';
                  let barClass = 'bg-status-green';
                  if (project.status === 'Delayed' || project.status === 'At Risk') {
                    statusClass = 'bg-amber-100 text-amber-700';
                    barClass = 'bg-status-amber';
                  }
                  if (project.status === 'Critical') {
                    statusClass = 'bg-red-100 text-red-700';
                    barClass = 'bg-status-red';
                  }

                  const formattedValue = `₦${(project.budgetAllocated / 1000000000).toFixed(1)}B`;

                  return (
                    <tr key={project._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{project.projectId}</td>
                      <td className="px-6 py-4 text-brand-green font-medium cursor-pointer hover:underline">
                        <Link href={`/projects/${project.projectId}`}>{project.title}</Link>
                      </td>
                      <td className="px-6 py-4">{project.lga}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs">{project.sector}</span>
                      </td>
                      <td className="px-6 py-4">{project.contractorId?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 font-semibold">{formattedValue}</td>
                      <td className="px-6 py-4">
                        <span className={`${statusClass} px-2.5 py-1 rounded-full text-xs font-semibold`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-slate-200 rounded-full h-2 min-w-[60px]">
                            <div
                              className={`h-2 rounded-full ${barClass}`}
                              style={{ width: `${project.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-slate-600">{project.progressPercentage}%</span>
                        </div>
                      </td>
                      {user?.role === 'Admin' && (
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => openEditModal(project)}
                            className="text-brand-green hover:text-brand-dark font-medium text-sm transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <span className="text-sm text-slate-500">
                Page <span className="font-semibold text-slate-700">{page}</span> of <span className="font-semibold text-slate-700">{totalPages}</span>
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm font-medium border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm font-medium border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Project</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LGA</label>
                <input required type="text" value={formData.lga} onChange={e => setFormData({...formData, lga: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <select required value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>Road</option><option>Housing</option><option>Bridge</option><option>Public Building</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget Allocated (₦)</label>
                <input required type="number" value={formData.budgetAllocated} onChange={e => setFormData({...formData, budgetAllocated: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Contractor</label>
                <select required value={formData.contractorId} onChange={e => setFormData({...formData, contractorId: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Select a Contractor...</option>
                  {contractorsData?.contractors?.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Completion</label>
                <input required type="date" value={formData.estimatedCompletion} onChange={e => setFormData({...formData, estimatedCompletion: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50">
                  {createMutation.isPending ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Edit Project</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); editMutation.mutate(formData); }} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LGA</label>
                <input required type="text" value={formData.lga} onChange={e => setFormData({...formData, lga: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <select required value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>Road</option><option>Housing</option><option>Bridge</option><option>Public Building</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>On Track</option><option>Delayed</option><option>At Risk</option><option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Progress Percentage (%)</label>
                <input required type="number" min="0" max="100" value={formData.progressPercentage} onChange={e => setFormData({...formData, progressPercentage: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget Allocated (₦)</label>
                <input required type="number" value={formData.budgetAllocated} onChange={e => setFormData({...formData, budgetAllocated: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Contractor</label>
                <select required value={formData.contractorId} onChange={e => setFormData({...formData, contractorId: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Select a Contractor...</option>
                  {contractorsData?.contractors?.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Completion</label>
                <input required type="date" value={formData.estimatedCompletion} onChange={e => setFormData({...formData, estimatedCompletion: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={editMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50">
                  {editMutation.isPending ? 'Updating...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-6 border-t border-slate-200 mt-auto bg-white text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-8">
          Powered by Haigha Technology · Secure · ISO-aligned · Built for Borno
        </div>
      </footer>
    </div>
  );
}
