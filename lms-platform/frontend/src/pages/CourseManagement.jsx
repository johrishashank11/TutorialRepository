import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, UploadCloud, Link as LinkIcon, CheckCircle, XCircle } from 'lucide-react';
import { AppTable } from '../components/common/AppTable';
import { AppModal } from '../components/common/AppModal';
import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { AppBadge } from '../components/common/AppBadge';
import { useToast } from '../hooks/useToast';
import { fetchCourses, fetchBatches, createCourse, updateCourse, uploadCourseContent, assignBatchToCourse } from '../services/lmsService';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Form states
  const [currentCourse, setCurrentCourse] = useState({ id: null, title: '', description: '', active: true });
  const [file, setFile] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, batchesRes] = await Promise.all([fetchCourses(), fetchBatches()]);
      setCourses(coursesRes.data || []);
      setBatches(batchesRes.data || []);
    } catch (err) {
      toast.error('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse.id) {
        await updateCourse(currentCourse.id, currentCourse);
        toast.success('Course updated successfully.');
      } else {
        await createCourse(currentCourse);
        toast.success('Course created successfully.');
      }
      setIsCourseModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to save course.');
    }
  };

  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (!currentCourse.id || !file) return;

    const formData = new FormData();
    formData.append('file', file);
    const ext = file.name.split('.').pop().toUpperCase();
    let fileType = 'DOCUMENT';
    if (['MP4', 'MOV', 'AVI'].includes(ext)) fileType = 'VIDEO';
    if (ext === 'PDF') fileType = 'PDF';
    if (ext === 'ZIP') fileType = 'SCORM';

    formData.append('fileType', fileType);

    try {
      await uploadCourseContent(currentCourse.id, formData);
      setIsContentModalOpen(false);
      setFile(null);
      toast.success('Content uploaded successfully.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    }
  };

  const handleAssignBatch = async (e) => {
    e.preventDefault();
    if (!currentCourse.id || !selectedBatchId) return;
    try {
      await assignBatchToCourse(selectedBatchId, currentCourse.id);
      setIsBatchModalOpen(false);
      toast.success('Course assigned to batch!');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to assign batch.');
    }
  };

  const columns = [
    {
      header: 'Course Title',
      accessor: 'title',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">{row.description}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (row) => (
        <AppBadge status={row.active ? 'success' : 'danger'}>
          {row.active ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
          {row.active ? 'Active' : 'Inactive'}
        </AppBadge>
      )
    },
    {
      header: 'Contents',
      accessor: 'contents',
      render: (row) => <span className="text-xs font-medium text-gray-500">{row.contents?.length || 0} modules</span>
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => { setCurrentCourse(row); setIsCourseModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg">
            <Edit2 size={16} />
          </button>
          <button onClick={() => { setCurrentCourse(row); setFile(null); setIsContentModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
            <UploadCloud size={16} />
          </button>
          <button onClick={() => { setCurrentCourse(row); setSelectedBatchId(''); setIsBatchModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
            <LinkIcon size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-brand-600" /> Course Management
          </h1>
        </div>
        <AppButton onClick={() => { setCurrentCourse({ id: null, title: '', description: '', active: true }); setIsCourseModalOpen(true); }}>
          <Plus size={18} className="mr-1"/> Create New Course
        </AppButton>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <AppTable columns={columns} data={courses} />
      </div>

      {/* Course Modal */}
      <AppModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title={currentCourse.id ? 'Edit Course' : 'Create Course'}>
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <AppInput label="Title" value={currentCourse.title} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} required />
          <AppInput label="Description" value={currentCourse.description} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="activeToggle" className="w-4 h-4 text-brand-600 rounded" checked={currentCourse.active} onChange={e => setCurrentCourse({...currentCourse, active: e.target.checked})} />
            <label htmlFor="activeToggle" className="text-sm font-medium text-gray-700">Course is Active</label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <AppButton variant="ghost" onClick={() => setIsCourseModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit">Save</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Content Modal */}
      <AppModal isOpen={isContentModalOpen} onClose={() => setIsContentModalOpen(false)} title="Upload Content">
        <form onSubmit={handleUploadContent} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 relative cursor-pointer">
            <UploadCloud size={32} className="text-brand-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Select file (MP4, PDF, DOCX, ZIP)</span>
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} required />
          </div>
          {file && <div className="text-sm text-emerald-600 font-medium text-center">{file.name}</div>}
          <div className="mt-6 flex justify-end gap-3">
            <AppButton variant="ghost" onClick={() => setIsContentModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" disabled={!file}>Upload</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Batch Modal */}
      <AppModal isOpen={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} title="Link to Batch">
        <form onSubmit={handleAssignBatch} className="space-y-4">
          <select className="w-full border p-2.5 rounded-lg bg-white" value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)} required>
            <option value="">Choose a batch...</option>
            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <div className="mt-6 flex justify-end gap-3">
            <AppButton variant="ghost" onClick={() => setIsBatchModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit">Link Batch</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
}

export default CourseManagement;
