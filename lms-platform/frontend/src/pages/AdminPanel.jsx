import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Users, FileSpreadsheet, UploadCloud, Plus } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={28} className="text-white" />
      </div>
    </div>
  );
}

function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [file, setFile] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [bulkFile, setBulkFile] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/lms/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lms/courses', { title: courseTitle, description: 'Newly created course' });
      setCourseTitle('');
      setIsCourseModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', file.name.split('.').pop().toUpperCase());

    try {
      await api.post(`/lms/courses/${selectedCourseId}/contents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsContentModalOpen(false);
      alert('Content uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;

    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      await api.post('/lms/bulk-upload/batches', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Batches bulk uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Bulk upload failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-1">Manage courses, trainees, and organization batches.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Courses" value={courses.length} icon={BookOpen} color="bg-blue-500" />
        <StatCard title="Active Batches" value="12" icon={FileSpreadsheet} color="bg-brand-500" />
        <StatCard title="Total Users" value="1,248" icon={Users} color="bg-emerald-500" />
      </div>

      {/* Management Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Course Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen size={20} className="text-gray-400" /> Course Directory
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCourseModalOpen(true)}
                className="flex items-center gap-1 bg-brand-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
              >
                <Plus size={16} /> New
              </button>
              <button
                onClick={() => setIsContentModalOpen(true)}
                className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
              >
                <UploadCloud size={16} /> Content
              </button>
            </div>
          </div>
          <div className="p-0 overflow-auto max-h-[400px]">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3 border-b">ID</th>
                  <th className="px-6 py-3 border-b">Title</th>
                  <th className="px-6 py-3 border-b text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No courses available.</td>
                  </tr>
                )}
                {courses.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-3 font-medium text-gray-900">#{c.id}</td>
                    <td className="px-6 py-3">{c.title}</td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-brand-600 hover:text-brand-800 font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batch Bulk Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <FileSpreadsheet size={20} className="text-gray-400" /> Bulk Provision Batches
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Upload a CSV or Excel (.xlsx) file to instantly provision processes and batches across the organization.
          </p>

          <form onSubmit={handleBulkUpload} className="flex-1 flex flex-col justify-center gap-6">
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-8 hover:bg-gray-100 transition cursor-pointer relative">
              <UploadCloud size={48} className="text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 font-medium text-center">
                Drag & drop your file here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports .csv, .xls, .xlsx (Max 10MB)</p>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={e => setBulkFile(e.target.files[0])}
                required
              />
            </div>

            {bulkFile && (
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
                <span>Selected: {bulkFile.name}</span>
                <button type="button" onClick={() => setBulkFile(null)} className="text-emerald-900 hover:text-emerald-950">Remove</button>
              </div>
            )}

            <button
              type="submit"
              disabled={!bulkFile}
              className={`w-full py-3 rounded-xl font-semibold transition shadow-sm ${
                bulkFile
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Provisioning
            </button>
          </form>
        </div>

      </div>

      {/* Course Creation Modal */}
      <Transition appear show={isCourseModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsCourseModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-4">
                    Create New Course
                  </Dialog.Title>
                  <form onSubmit={handleCreateCourse}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                      <input
                        type="text"
                        className="w-full border-gray-300 border p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        value={courseTitle}
                        onChange={e => setCourseTitle(e.target.value)}
                        required
                        placeholder="e.g. NHT Compliance Training 2026"
                      />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg">Create</button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Content Upload Modal */}
      <Transition appear show={isContentModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsContentModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-4">
                    Upload Course Material
                  </Dialog.Title>
                  <form onSubmit={handleUploadContent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Course</label>
                      <select
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                        value={selectedCourseId}
                        onChange={e => setSelectedCourseId(e.target.value)}
                        required
                      >
                        <option value="">Select Course...</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">File (PPT, PDF, Video, SCORM)</label>
                       <input
                        type="file"
                        className="w-full border border-gray-300 p-2 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                        onChange={e => setFile(e.target.files[0])}
                        required
                      />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsContentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg">Upload</button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}

export default AdminPanel;
