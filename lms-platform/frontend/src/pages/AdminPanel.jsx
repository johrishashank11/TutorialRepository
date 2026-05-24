import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

function AdminPanel() {
  const { logout } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [file, setFile] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [bulkFile, setBulkFile] = useState(null);

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
      await api.post('/lms/courses', { title: courseTitle, description: '' });
      setCourseTitle('');
      fetchCourses();
      alert('Course created');
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={logout} className="flex items-center gap-2 hover:text-gray-200">
          <LogOut size={20} /> Logout
        </button>
      </header>

      <main className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Create Course */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Create Course</h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <input
              type="text"
              placeholder="Course Title"
              className="w-full border p-2 rounded"
              value={courseTitle}
              onChange={e => setCourseTitle(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
          </form>
        </div>

        {/* Upload Course Material */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Upload Content</h2>
          <form onSubmit={handleUploadContent} className="space-y-4">
            <select
              className="w-full border p-2 rounded"
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              required
            >
              <option value="">Select Course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <input
              type="file"
              className="w-full border p-2 rounded"
              onChange={e => setFile(e.target.files[0])}
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Upload Material</button>
          </form>
        </div>

        {/* Bulk Upload Batches */}
        <div className="bg-white p-6 rounded shadow col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Bulk Upload Batches (CSV/Excel)</h2>
          <form onSubmit={handleBulkUpload} className="flex gap-4">
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              className="border p-2 rounded flex-1"
              onChange={e => setBulkFile(e.target.files[0])}
              required
            />
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">Bulk Upload</button>
          </form>
        </div>

      </main>
    </div>
  );
}

export default AdminPanel;
