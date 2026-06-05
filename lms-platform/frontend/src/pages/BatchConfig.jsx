import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileSpreadsheet, Building2, GitBranch, Layers, BookOpen, ChevronDown, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../layouts/DashboardLayout';

function BatchConfig() {
  const [batches, setBatches] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());

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

  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="text-brand-600" /> Batch Configuration
        </h1>
        <p className="text-gray-500 mt-1">Read-only view of organization batches, hierarchy mapping, and course assignments.</p>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4 border-b w-10"></th>
                <th className="px-6 py-4 border-b">Batch Name</th>
                <th className="px-6 py-4 border-b">Line of Business (LOB)</th>
                <th className="px-6 py-4 border-b">Process</th>
                <th className="px-6 py-4 border-b">Sub-Process</th>
                <th className="px-6 py-4 border-b text-right">Mapped Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {batches.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No batches found. Upload batches from the main dashboard to see them here.
                  </td>
                </tr>
              )}

              {batches.map((b) => {
                const isExpanded = expandedRows.has(b.id);
                const hasCourses = b.courses && b.courses.length > 0;

                return (
                  <React.Fragment key={b.id}>
                    <tr
                      onClick={() => toggleRow(b.id)}
                      className={cn(
                        "transition cursor-pointer",
                        isExpanded ? "bg-brand-50/50" : "hover:bg-gray-50"
                      )}
                    >
                      <td className="px-6 py-4 text-gray-400">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{b.name}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5"><Building2 size={16} className="text-gray-400"/> {b.process?.lineOfBusiness || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5"><Layers size={16} className="text-brand-400"/> {b.process?.name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5"><GitBranch size={16} className="text-gray-400"/> {b.process?.subProcess || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        <span className={cn(
                          "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold",
                          hasCourses ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {b.courses?.length || 0} Courses
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="6" className="bg-gray-50/80 p-0 border-b border-gray-100">
                          <div className="px-14 py-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <BookOpen size={16}/> Assigned Course Curriculum
                            </h4>

                            {!hasCourses ? (
                              <p className="text-sm text-gray-500 italic">No courses have been mapped to this batch yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {b.courses.map((course) => (
                                  <div key={course.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-bold text-gray-900 truncate pr-2">{course.title}</h5>
                                      {course.active ? (
                                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" title="Active Course"/>
                                      ) : (
                                        <XCircle size={16} className="text-red-500 flex-shrink-0" title="Inactive Course"/>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                                      {course.description || "No description provided."}
                                    </p>
                                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs font-medium text-gray-500">
                                      <span>ID: #{course.id}</span>
                                      <span>Modules: {course.contents?.length || 0}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BatchConfig;
