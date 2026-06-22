"use client";

import { SubNav } from "@/components/layout/SubNav";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Plus, X, Pencil } from 'lucide-react';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export default function ContractorsPage() {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    name: '', email: '', phone: '', status: 'Active'
  };
  const [formData, setFormData] = useState(initialFormState);

  const { data, error, isLoading } = useQuery({
    queryKey: ['contractors', page],
    queryFn: () => fetcher(`/api/contractors?page=${page}&limit=6`)
  });

  const createMutation = useMutation({
    mutationFn: async (newContractor: any) => {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContractor)
      });
      if (!res.ok) throw new Error('Failed to create contractor');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      setShowModal(false);
      setFormData(initialFormState);
    }
  });

  const editMutation = useMutation({
    mutationFn: async (updatedContractor: any) => {
      const res = await fetch(`/api/contractors/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContractor)
      });
      if (!res.ok) throw new Error('Failed to update contractor');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      setShowEditModal(false);
      setFormData(initialFormState);
      setEditingId(null);
    }
  });

  const openEditModal = (contractor: any) => {
    setEditingId(contractor._id);
    setFormData({
      name: contractor.name,
      email: contractor.email,
      phone: contractor.phone,
      status: contractor.status
    });
    setShowEditModal(true);
  };
  
  const contractors = data?.contractors || [];
  const totalPages = data?.totalPages || 1;
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">

      <SubNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Contractor Directory & Scorecards</h2>
            <p className="text-slate-500 mt-1">Review contractor performance metrics, timeliness, and quality ratings.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by ID or Name..." 
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none w-64 bg-white"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {user?.role === 'Admin' && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Contractor</span>
              </button>
            )}
          </div>
        </div>

        {isLoading && <div className="p-8 text-center text-slate-500 animate-pulse">Loading contractor directory...</div>}
        {error && <div className="p-8 text-center text-red-500">Failed to load contractors</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contractors.map((contractor: any) => (
            <div key={contractor._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{contractor.name}</h3>
                  <span className="text-xs text-slate-500">{contractor.contractorId} • {contractor.activeProjects} Active Projects</span>
                </div>
                <div className="flex space-x-2">
                  {user?.role === 'Admin' && (
                    <button onClick={() => openEditModal(contractor)} className="text-slate-400 hover:text-brand-green">
                      <Pencil size={16} />
                    </button>
                  )}
                  {contractor.status === "Active" && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Active</span>}
                  {contractor.status === "Warning" && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Warning</span>}
                  {contractor.status === "Blacklisted" && <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Blacklisted</span>}
                </div>
              </div>

              <div className="mt-2 flex-1 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Timeliness</span>
                    <span className="font-semibold">{contractor.overallScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-brand-green h-1.5 rounded-full" style={{ width: `${contractor.overallScore}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Quality</span>
                    <span className="font-semibold">{contractor.overallScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-brand-green h-1.5 rounded-full" style={{ width: `${contractor.overallScore}%` }}></div></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-slate-500">Overall Score: </span>
                  <span className={`font-bold ${contractor.overallScore >= 80 ? 'text-status-green' : contractor.overallScore >= 60 ? 'text-status-amber' : 'text-status-red'}`}>
                    {contractor.overallScore}%
                  </span>
                </div>
                <Link href={`/contractors/${contractor.contractorId}`} className="text-brand-green text-sm font-medium hover:underline">View Profile</Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Contractor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Contractor</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Status</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>Active</option><option>Warning</option><option>Blacklisted</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50">
                  {createMutation.isPending ? 'Saving...' : 'Save Contractor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contractor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Edit Contractor</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); editMutation.mutate(formData); }} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>Active</option><option>Warning</option><option>Blacklisted</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={editMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50">
                  {editMutation.isPending ? 'Updating...' : 'Update Contractor'}
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
