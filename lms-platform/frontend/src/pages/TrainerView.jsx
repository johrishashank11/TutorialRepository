import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, CheckCircle, Clock, BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for Recharts to show modern UI capabilities
const analyticsData = [
  { name: 'Batch A', completed: 85, pending: 15 },
  { name: 'Batch B', completed: 60, pending: 40 },
  { name: 'Batch C', completed: 95, pending: 5 },
  { name: 'Batch D', completed: 40, pending: 60 },
];

function TrainerView() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/lms/batches');
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trainer Workspace</h1>
          <p className="text-gray-500 mt-1">Monitor batch progress, trainee engagement, and assessment outcomes.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition">
            <BarChart3 size={16} /> Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Col - Batch List Grid */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batches.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Active Batches</h3>
                <p className="text-gray-500">You currently have no batches assigned to monitor.</p>
              </div>
            ) : (
              batches.map(batch => (
                <div key={batch.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="p-5 border-b border-gray-100 bg-brand-50/30 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{batch.name}</h3>
                      <p className="text-sm text-brand-600 font-medium mt-0.5">{batch.process?.name || 'Unassigned Process'}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600"><Users size={16} className="text-gray-400"/> Total Trainees</span>
                        <span className="font-semibold text-gray-900">{batch.traineeIds?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600"><CheckCircle size={16} className="text-emerald-500"/> Avg Completion</span>
                        <span className="font-semibold text-gray-900">0%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600"><Clock size={16} className="text-amber-500"/> Pending Assessments</span>
                        <span className="font-semibold text-gray-900">{batch.courses?.length || 0}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                      <button className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition border border-gray-200">
                        View Roster
                      </button>
                      <button className="flex-1 bg-brand-50 text-brand-700 py-2 rounded-lg font-medium text-sm hover:bg-brand-100 transition">
                        View Analytics
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col - Visual Analytics (Recharts) */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-500" /> Completion Rates
              </h2>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="completed" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} name="Completed (%)" />
                  <Bar dataKey="pending" stackId="a" fill="#F3F4F6" radius={[4, 4, 0, 0]} name="Pending (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-sm text-white">
            <h2 className="text-lg font-semibold mb-2">Attention Required</h2>
            <p className="text-slate-300 text-sm mb-4">3 trainees in Batch D are falling behind their target progression rate by more than 20%.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2 rounded-lg text-sm font-medium transition">
              Review Interventions
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TrainerView;
