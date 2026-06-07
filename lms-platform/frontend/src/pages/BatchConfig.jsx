import React, { useState, useEffect, Fragment } from 'react';
import { FileSpreadsheet, Building2, GitBranch, Layers, BookOpen, ChevronDown, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { AppBadge } from '../components/common/AppBadge';
import { useToast } from '../hooks/useToast';
import { fetchBatches } from '../services/lmsService';

function BatchConfig() {
  const [batches, setBatches] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchBatches();
      setBatches(res.data || []);
    } catch (err) {
      toast.error('Failed to load batches.');
    }
  };

  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) newExpandedRows.delete(id);
    else newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileSpreadsheet className="text-brand-600" /> Batch Configuration
        </h1>
        <p className="text-gray-500 mt-1">View organization batches and mapping.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-medium">
            <tr>
              <th className="px-6 py-4 border-b w-10"></th>
              <th className="px-6 py-4 border-b">Batch Name</th>
              <th className="px-6 py-4 border-b">Line of Business</th>
              <th className="px-6 py-4 border-b">Process</th>
              <th className="px-6 py-4 border-b">Sub-Process</th>
              <th className="px-6 py-4 border-b text-right">Mapped Courses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {batches.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No batches found.</td></tr>
            )}
            {batches.map((b) => {
              const isExpanded = expandedRows.has(b.id);
              const hasCourses = b.courses && b.courses.length > 0;
              return (
                <Fragment key={b.id}>
                  <tr onClick={() => toggleRow(b.id)} className={`transition cursor-pointer ${isExpanded ? "bg-brand-50/50" : "hover:bg-gray-50"}`}>
                    <td className="px-6 py-4 text-gray-400">{isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{b.name}</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1.5"><Building2 size={16}/> {b.process?.lineOfBusiness || 'N/A'}</span></td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1.5"><Layers size={16}/> {b.process?.name || 'N/A'}</span></td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1.5"><GitBranch size={16}/> {b.process?.subProcess || 'N/A'}</span></td>
                    <td className="px-6 py-4 text-right">
                      <AppBadge status={hasCourses ? 'brand' : 'default'}>{b.courses?.length || 0} Courses</AppBadge>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="6" className="bg-gray-50/80 p-0 border-b border-gray-100">
                        <div className="px-14 py-6">
                          <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-4"><BookOpen size={16}/> Curriculum</h4>
                          {!hasCourses ? <p className="text-sm text-gray-500 italic">No courses mapped.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {b.courses.map((course) => (
                                <div key={course.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col">
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-gray-900 truncate pr-2">{course.title}</h5>
                                    {course.active ? <CheckCircle size={16} className="text-emerald-500"/> : <XCircle size={16} className="text-red-500"/>}
                                  </div>
                                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{course.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BatchConfig;
