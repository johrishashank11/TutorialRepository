import React, { useState, useEffect, Fragment } from 'react';
import { FileQuestion, UploadCloud, Plus, X, ServerCrash, LibraryBig } from 'lucide-react';
import { AppModal } from '../components/common/AppModal';
import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { AppBadge } from '../components/common/AppBadge';
import { useToast } from '../hooks/useToast';
import { fetchTests, fetchCourses, createManualTest, uploadBulkTest } from '../services/lmsService';

function TestManagement() {
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const toast = useToast();

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [testType, setTestType] = useState('QUIZ');
  const [questions, setQuestions] = useState([{ text: '', options: '', correctAnswer: '' }]);
  const [bulkFile, setBulkFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courseRes, testRes] = await Promise.all([fetchCourses(), fetchTests()]);
      setCourses(courseRes.data || []);
      setTests(testRes.data || []);
    } catch (err) {
      toast.error('Failed to load tests.');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return toast.error('Select a course');
    try {
      await createManualTest(selectedCourseId, { title: testTitle, type: testType, questions });
      setIsTestModalOpen(false);
      toast.success('Test created successfully!');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to create test.');
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !bulkFile) return toast.error('Select a course and file');
    const formData = new FormData();
    formData.append('title', testTitle);
    formData.append('type', testType);
    formData.append('file', bulkFile);
    try {
      await uploadBulkTest(selectedCourseId, formData);
      setIsBulkModalOpen(false);
      setBulkFile(null);
      toast.success('Bulk test uploaded successfully!');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Bulk upload failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileQuestion className="text-brand-600" /> Assessment Management
          </h1>
        </div>
        <div className="flex gap-2">
          <AppButton onClick={() => setIsBulkModalOpen(true)} variant="outline"><UploadCloud size={18} className="mr-1"/> Bulk Import</AppButton>
          <AppButton onClick={() => setIsTestModalOpen(true)}><Plus size={18} className="mr-1"/> Manual Test</AppButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tests.map(test => (
          <div key={test.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-50">
              <AppBadge status={test.type === 'QUIZ' ? 'brand' : 'info'} className="mb-2">{test.type}</AppBadge>
              <h3 className="font-bold text-gray-900 line-clamp-1">{test.title}</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5 line-clamp-2 mb-4">
                <LibraryBig size={16} className="text-brand-500" /> {courses.find(c => c.id === test.course?.id)?.title || 'Course'}
              </p>
              <div className="pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                <span>Questions: {test.questions?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AppModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} title="Create Test" maxWidth="max-w-2xl">
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <select className="w-full border p-2 rounded-lg bg-white" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} required>
            <option value="">Select Course...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <AppInput label="Test Title" value={testTitle} onChange={e => setTestTitle(e.target.value)} required />
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 space-y-4 max-h-64 overflow-y-auto">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border">
                <AppInput placeholder="Question Text" value={q.text} onChange={e => {const n=[...questions]; n[idx].text=e.target.value; setQuestions(n);}} required />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <AppInput placeholder="Options CSV" value={q.options} onChange={e => {const n=[...questions]; n[idx].options=e.target.value; setQuestions(n);}} />
                  <AppInput placeholder="Exact Answer" value={q.correctAnswer} onChange={e => {const n=[...questions]; n[idx].correctAnswer=e.target.value; setQuestions(n);}} required />
                </div>
              </div>
            ))}
            <AppButton type="button" variant="ghost" size="sm" onClick={() => setQuestions([...questions, {text:'', options:'', correctAnswer:''}])}>Add Row</AppButton>
          </div>
          <div className="flex justify-end gap-2 mt-4"><AppButton type="submit">Save</AppButton></div>
        </form>
      </AppModal>

      <AppModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Bulk Import">
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <select className="w-full border p-2 rounded-lg bg-white" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} required>
            <option value="">Select Course...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <AppInput label="Test Title" value={testTitle} onChange={e => setTestTitle(e.target.value)} required />
          <input type="file" onChange={e => setBulkFile(e.target.files[0])} required className="w-full border p-2 rounded" />
          <div className="flex justify-end gap-2 mt-4"><AppButton type="submit">Upload</AppButton></div>
        </form>
      </AppModal>
    </div>
  );
}

export default TestManagement;
