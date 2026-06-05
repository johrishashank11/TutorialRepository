import React, { useState, useEffect, Fragment } from 'react';
import api from '../services/api';
import { BookOpen, Plus, Edit2, UploadCloud, Link as LinkIcon, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '../layouts/DashboardLayout';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Form states
  const [currentCourse, setCurrentCourse] = useState({ id: null, title: '', description: '', active: true });
  const [file, setFile] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/lms/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await api.get('/lms/batches');
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse.id) {
        await api.put(`/lms/courses/${currentCourse.id}`, currentCourse);
      } else {
        await api.post('/lms/courses', currentCourse);
      }
      setIsCourseModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error("Failed to save course", err);
    }
  };

  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (!currentCourse.id || !file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Determine type from extension
    const ext = file.name.split('.').pop().toUpperCase();
    let fileType = 'DOCUMENT';
    if (['MP4', 'MOV', 'AVI'].includes(ext)) fileType = 'VIDEO';
    if (ext === 'PDF') fileType = 'PDF';
    if (ext === 'ZIP') fileType = 'SCORM';

    formData.append('fileType', fileType);

    try {
      await api.post(`/lms/courses/${currentCourse.id}/contents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsContentModalOpen(false);
      setFile(null);
      fetchCourses();
      alert('Content uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleAssignBatch = async (e) => {
    e.preventDefault();
    if (!currentCourse.id || !selectedBatchId) return;
    try {
      await api.post(`/lms/batches/${selectedBatchId}/courses/${currentCourse.id}`);
      setIsBatchModalOpen(false);
      alert('Course successfully assigned to batch!');
    } catch (err) {
      console.error(err);
      alert('Failed to assign batch.');
    }
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setIsCourseModalOpen(true);
  };

  const openNewModal = () => {
    setCurrentCourse({ id: null, title: '', description: '', active: true });
    setIsCourseModalOpen(true);
  };

  const openContentModal = (course) => {
    setCurrentCourse(course);
    setFile(null);
    setIsContentModalOpen(true);
  };

  const openBatchModal = (course) => {
    setCurrentCourse(course);
    setSelectedBatchId('');
    setIsBatchModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="text-brand-600" /> Course Management
          </h1>
          <p className="text-gray-500 mt-1">Create, edit, and orchestrate learning curriculums.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition"
        >
          <Plus size={18} /> Create New Course
        </button>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4 border-b">Course Title</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b">Contents</th>
                <th className="px-6 py-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    No courses available. Click "Create New Course" to get started.
                  </td>
                </tr>
              )}
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{c.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      c.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {c.active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">
                    {c.contents?.length || 0} modules
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        title="Edit Course"
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => openContentModal(c)}
                        title="Upload Content"
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <UploadCloud size={16} />
                      </button>
                      <button
                        onClick={() => openBatchModal(c)}
                        title="Link to Batch"
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                      >
                        <LinkIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Create/Edit Course Modal */}
      <Transition appear show={isCourseModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsCourseModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold text-gray-900 mb-4">
                  {currentCourse.id ? 'Edit Course' : 'Create New Course'}
                </Dialog.Title>
                <form onSubmit={handleSaveCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" required className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      value={currentCourse.title} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows="3" className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      value={currentCourse.description} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="activeToggle" className="w-4 h-4 text-brand-600 rounded border-gray-300"
                      checked={currentCourse.active} onChange={e => setCurrentCourse({...currentCourse, active: e.target.checked})} />
                    <label htmlFor="activeToggle" className="text-sm font-medium text-gray-700">Course is Active</label>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg">Save</button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Upload Content Modal */}
      <Transition appear show={isContentModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsContentModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold text-gray-900 mb-1">
                  Manage Content
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-6">Target: {currentCourse.title}</p>

                {/* Existing Contents List */}
                {currentCourse.contents && currentCourse.contents.length > 0 && (
                  <div className="mb-6 space-y-2 max-h-40 overflow-y-auto pr-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Modules</h4>
                    {currentCourse.contents.map(content => (
                       <div key={content.id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                         <div className="truncate text-sm font-medium text-gray-700 max-w-[200px]">{content.fileName}</div>
                         <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">{content.fileType}</span>
                       </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleUploadContent} className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upload New Material</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 relative transition cursor-pointer">
                    <UploadCloud size={32} className="text-brand-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Click to select file</span>
                    <span className="text-xs text-gray-400 mt-1">MP4, PDF, DOCX, TXT, SCORM(ZIP)</span>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => setFile(e.target.files[0])}
                      required
                    />
                  </div>
                  {file && <div className="text-sm font-medium text-emerald-600 text-center">Selected: {file.name}</div>}

                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsContentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Done</button>
                    <button type="submit" disabled={!file} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg disabled:bg-gray-300">Upload</button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Assign Batch Modal */}
      <Transition appear show={isBatchModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsBatchModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold text-gray-900 mb-1">
                  Link Course to Batch
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-6">Assigning "{currentCourse.title}"</p>

                <form onSubmit={handleAssignBatch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Target Batch</label>
                    <select
                      className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
                      value={selectedBatchId}
                      onChange={e => setSelectedBatchId(e.target.value)}
                      required
                    >
                      <option value="">Choose a batch...</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} (Process: {b.process?.name})</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsBatchModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm">Link Batch</button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}

export default CourseManagement;
