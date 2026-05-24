import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Users, CheckCircle, Clock } from 'lucide-react';

function TrainerView() {
  const { logout } = useContext(AuthContext);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2"><Users size={24} /> Trainer Dashboard</h1>
        <button onClick={logout} className="flex items-center gap-2 hover:text-gray-200">
          <LogOut size={20} /> Logout
        </button>
      </header>

      <main className="p-8">
        <h2 className="text-2xl font-bold mb-6">My Batches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.length === 0 ? (
            <p className="text-gray-500">No batches currently assigned.</p>
          ) : (
            batches.map(batch => (
              <div key={batch.id} className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-500">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{batch.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Process: {batch.process?.name || 'N/A'}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600"><Users size={16}/> Trainees</span>
                    <span className="font-semibold">{batch.traineeIds?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle size={16}/> Avg Completion</span>
                    <span className="font-semibold">0%</span> {/* Placeholder logic */}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-yellow-600"><Clock size={16}/> Pending Tests</span>
                    <span className="font-semibold">{batch.courses?.length || 0}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full bg-indigo-50 text-indigo-600 py-2 rounded font-medium hover:bg-indigo-100 transition">
                    View Analytics
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default TrainerView;
