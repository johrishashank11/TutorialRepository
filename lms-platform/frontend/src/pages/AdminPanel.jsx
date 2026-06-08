import React, { useState, useEffect } from 'react';
import { BookOpen, Users, FileSpreadsheet, UploadCloud, Plus } from 'lucide-react';
import { AppModal } from '../components/common/AppModal';
import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { AppTable } from '../components/common/AppTable';
import { AppLoader } from '../components/common/AppLoader';
import { useToast } from '../hooks/useToast';
import { fetchCourses, createCourse, uploadCourseContent, uploadBatchesBulk } from '../services/lmsService';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
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

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetchCourses();
      setCourses(res.data || []);
    } catch (err) {
      toast.error('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCourse({ title: courseTitle, description: 'Newly created course', active: true });
      setCourseTitle('');
      setIsCourseModalOpen(false);
      toast.success('Course created.');
      loadCourses();
    } catch (err) {
      toast.error(err.message || 'Creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !file) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    const ext = file.name.split('.').pop().toUpperCase();
    let fileType = 'DOCUMENT';
    if (['MP4', 'MOV', 'AVI'].includes(ext)) fileType = 'VIDEO';
    if (ext === 'PDF') fileType = 'PDF';
    if (ext === 'ZIP') fileType = 'SCORM';
    formData.append('fileType', fileType);

    try {
      await uploadCourseContent(selectedCourseId, formData);
      setIsContentModalOpen(false);
      setFile(null);
      toast.success('Content uploaded successfully.');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      await uploadBatchesBulk(formData);
      toast.success('Batches provisioned successfully.');
      setBulkFile(null);
    } catch (err) {
      toast.error(err.message || 'Bulk upload failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <AppLoader fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-1">Manage courses, trainees, and organization batches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Courses" value={courses.length} icon={BookOpen} color="bg-blue-500" />
        <StatCard title="Active Batches" value="12" icon={FileSpreadsheet} color="bg-brand-500" />
        <StatCard title="Total Users" value="1,248" icon={Users} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen size={20} className="text-gray-400" /> Quick Directory
            </h2>
            <div className="flex gap-2">
              <AppButton size="sm" onClick={() => setIsCourseModalOpen(true)}><Plus size={16} className="mr-1"/> New</AppButton>
              <AppButton size="sm" variant="outline" onClick={() => setIsContentModalOpen(true)}><UploadCloud size={16} className="mr-1"/> Content</AppButton>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <AppTable
              columns={[
                { header: 'ID', accessor: 'id', render: (row) => <span className="font-medium text-gray-900">#{row.id}</span> },
                { header: 'Title', accessor: 'title' }
              ]}
              data={courses}
              emptyMessage="No courses available."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <FileSpreadsheet size={20} className="text-gray-400" /> Bulk Provision Batches
          </h2>
          <p className="text-sm text-gray-500 mb-6">Upload a CSV or Excel (.xlsx) file to instantly provision processes and batches.</p>

          <form onSubmit={handleBulkUpload} className="flex-1 flex flex-col justify-center gap-6">
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-8 hover:bg-gray-100 transition cursor-pointer relative">
              <UploadCloud size={48} className="text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 font-medium text-center">Drag & drop your file here, or click to browse</p>
              <input type="file" accept=".csv, .xlsx, .xls" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setBulkFile(e.target.files[0])} required />
            </div>
            {bulkFile && <div className="text-sm font-medium text-emerald-600">Selected: {bulkFile.name}</div>}
            <AppButton type="submit" disabled={!bulkFile || isSubmitting} className="w-full justify-center">
              {isSubmitting ? <AppLoader size={18} className="text-white mr-2" /> : null}
              Start Provisioning
            </AppButton>
          </form>
        </div>
      </div>

      <AppModal isOpen={isCourseModalOpen} onClose={() => !isSubmitting && setIsCourseModalOpen(false)} title="Create New Course">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <AppInput label="Course Title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required placeholder="e.g. NHT Compliance Training" disabled={isSubmitting} />
          <div className="flex justify-end gap-2 mt-4">
            <AppButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? <AppLoader size={16} className="text-white mr-2" /> : null}
              Create
            </AppButton>
          </div>
        </form>
      </AppModal>

      <AppModal isOpen={isContentModalOpen} onClose={() => !isSubmitting && setIsContentModalOpen(false)} title="Upload Course Material">
        <form onSubmit={handleUploadContent} className="space-y-4">
          <select className="w-full border p-2.5 rounded-lg bg-white" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} required disabled={isSubmitting}>
            <option value="">Select Course...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input type="file" className="w-full border border-gray-300 p-2 rounded-lg text-sm" onChange={e => setFile(e.target.files[0])} required disabled={isSubmitting} />
          <div className="flex justify-end gap-2 mt-4">
            <AppButton type="submit" disabled={!file || isSubmitting}>
               {isSubmitting ? <AppLoader size={16} className="text-white mr-2" /> : null}
               Upload
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
}

export default AdminPanel;
