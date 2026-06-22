"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SubNav } from '@/components/layout/SubNav';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export default function FieldReportPage() {
  const { data: projectData } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => fetcher('/api/projects?limit=100')
  });
  const projects = projectData?.projects || [];

  const [formData, setFormData] = useState({
    projectId: '',
    engineerName: '',
    reportNotes: '',
    qualityRating: 50,
  });

  const [location, setLocation] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Not captured');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Capture Geolocation
  const captureLocation = () => {
    setLocationStatus('Locating...');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
          setLocationStatus('Captured successfully');
        },
        (error) => {
          setLocationStatus(`Error: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationStatus("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please capture GPS coordinates before submitting.");
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coordinates: location,
          photoUrls: [] // Placeholder for actual S3 URLs in production
        })
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Success! Report ID: ${result.visitId}`);
        setFormData({ ...formData, reportNotes: '', qualityRating: 50 });
        setLocation(null);
        setLocationStatus('Not captured');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`Failed to submit: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <SubNav />
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Mobile Field Report</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Project</label>
              <select 
                required
                value={formData.projectId}
                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-green focus:border-brand-green"
              >
                <option value="">-- Choose Project --</option>
                {projects.map((p: any) => (
                  <option key={p._id} value={p._id}>{p.projectId} - {p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Engineer Name</label>
              <input 
                type="text" required
                value={formData.engineerName}
                onChange={(e) => setFormData({...formData, engineerName: e.target.value})}
                className="w-full border border-slate-300 rounded-md px-3 py-2"
                placeholder="e.g. Engr. Babagana"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GPS Coordinates</label>
              <div className="flex items-center space-x-3">
                <button 
                  type="button" 
                  onClick={captureLocation}
                  className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-700"
                >
                  Lock GPS
                </button>
                <span className="text-sm text-slate-600 font-medium">
                  {location ? `Lat: ${location[0].toFixed(4)}, Lng: ${location[1].toFixed(4)}` : locationStatus}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Photo Evidence</label>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-green file:text-white hover:file:bg-emerald-600"
              />
              <p className="text-xs text-slate-400 mt-1">Image uploads simulated for MVP</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quality Rating (0-100)</label>
              <input 
                type="range" min="0" max="100" 
                value={formData.qualityRating}
                onChange={(e) => setFormData({...formData, qualityRating: Number(e.target.value)})}
                className="w-full"
              />
              <div className="text-right text-sm font-bold text-brand-green">{formData.qualityRating}%</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observation Notes</label>
              <textarea 
                required rows={3}
                value={formData.reportNotes}
                onChange={(e) => setFormData({...formData, reportNotes: e.target.value})}
                className="w-full border border-slate-300 rounded-md px-3 py-2"
                placeholder="Describe current status, delays, or safety concerns..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-green text-white font-bold py-3 rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Field Report'}
            </button>
            
            {message && (
              <div className={`p-3 rounded-md text-sm font-medium ${message.includes('Success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
