import React, { useState, useEffect, Fragment } from 'react';
import api from '../services/api';
import { FileQuestion, UploadCloud, Plus, X, ServerCrash, LibraryBig } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '../layouts/DashboardLayout';

function TestManagement() {
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);

  // Modals
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [testType, setTestType] = useState('QUIZ');
  const [questions, setQuestions] = useState([{ text: '', options: '', correctAnswer: '' }]);
  const [bulkFile, setBulkFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, testRes] = await Promise.all([
        api.get('/lms/courses'),
        api.get('/lms/assessments/tests')
      ]);
      setCourses(courseRes.data);
      setTests(testRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestionField = () => {
    setQuestions([...questions, { text: '', options: '', correctAnswer: '' }]);
  };

  const handleRemoveQuestionField = (idx) => {
    const newQ = [...questions];
    newQ.splice(idx, 1);
    setQuestions(newQ);
  };

  const handleQuestionChange = (idx, field, value) => {
    const newQ = [...questions];
    newQ[idx][field] = value;
    setQuestions(newQ);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert('Select a course');

    try {
      const payload = {
        title: testTitle,
        type: testType,
        questions: questions
      };
      await api.post(`/lms/assessments/courses/${selectedCourseId}/tests`, payload);
      setIsTestModalOpen(false);
      fetchData();
      alert('Test created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create test manually.');
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !bulkFile) return alert('Select a course and file');

    const formData = new FormData();
    formData.append('title', testTitle);
    formData.append('type', testType);
    formData.append('file', bulkFile);

    try {
      await api.post(`/lms/assessments/courses/${selectedCourseId}/tests/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsBulkModalOpen(false);
      setBulkFile(null);
      fetchData();
      alert('Bulk test uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Bulk upload failed.');
    }
  };

  const openManualModal = () => {
    setTestTitle('');
    setTestType('QUIZ');
    setSelectedCourseId('');
    setQuestions([{ text: '', options: '', correctAnswer: '' }]);
    setIsTestModalOpen(true);
  };

  const openBulkModal = () => {
    setTestTitle('');
    setTestType('QUIZ');
    setSelectedCourseId('');
    setBulkFile(null);
    setIsBulkModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileQuestion className="text-brand-600" /> Assessment & Test Management
          </h1>
          <p className="text-gray-500 mt-1">Design quizzes, email simulators, and configure tests across active courses.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openBulkModal}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-black transition"
          >
            <UploadCloud size={18} /> Bulk Import
          </button>
          <button
            onClick={openManualModal}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition"
          >
            <Plus size={18} /> Create Manual Test
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tests.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
             <ServerCrash size={48} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-lg font-medium text-gray-900">No Assessments Created</h3>
             <p className="text-gray-500">You haven't created any tests or quizzes yet.</p>
          </div>
        ) : (
          tests.map(test => (
            <div key={test.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
              <div className="p-5 border-b border-gray-50 flex items-start justify-between bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <span className={cn(
                    "inline-block px-2.5 py-1 rounded text-[10px] font-bold tracking-wider mb-2",
                    test.type === 'QUIZ' ? "bg-brand-100 text-brand-700" : "bg-purple-100 text-purple-700"
                  )}>
                    {test.type}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{test.title}</h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Attached Course</p>
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5 line-clamp-2">
                    <LibraryBig size={16} className="text-brand-500 flex-shrink-0" />
                    {courses.find(c => c.id === test.course?.id)?.title || 'Unknown Course'}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Questions: {test.questions?.length || 0}</span>
                  <button className="text-brand-600 hover:underline">Manage</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MANUAL CREATION MODAL --- */}
      <Transition appear show={isTestModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsTestModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                    Create Manual Test
                  </Dialog.Title>
                  <button onClick={() => setIsTestModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Course</label>
                      <select required className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                        value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
                        <option value="">Select Course...</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                      <select className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                        value={testType} onChange={e => setTestType(e.target.value)}>
                        <option value="QUIZ">Standard Quiz (MCQ)</option>
                        <option value="EMAIL_SIMULATOR">Email Simulator</option>
                        <option value="MANUAL_EVAL">Manual Evaluation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                    <input type="text" required className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-brand-500"
                      value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder="e.g. Final Assessment Module 1" />
                  </div>

                  {/* Question Builder */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-gray-700">Questions Builder</h4>
                      <button type="button" onClick={handleAddQuestionField} className="text-xs flex items-center gap-1 text-brand-600 font-medium hover:text-brand-800 bg-brand-50 px-2 py-1 rounded">
                        <Plus size={14} /> Add Row
                      </button>
                    </div>

                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {questions.map((q, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 relative group">
                          {questions.length > 1 && (
                            <button type="button" onClick={() => handleRemoveQuestionField(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover:block">
                              <X size={16} />
                            </button>
                          )}
                          <input type="text" placeholder={`Question ${idx + 1}`} required className="w-full text-sm border-b border-gray-200 pb-1 mb-2 outline-none focus:border-brand-500"
                            value={q.text} onChange={e => handleQuestionChange(idx, 'text', e.target.value)} />
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            <input type="text" placeholder="Options (comma separated)" className="w-full text-xs border border-gray-200 p-1.5 rounded outline-none"
                              value={q.options} onChange={e => handleQuestionChange(idx, 'options', e.target.value)} />
                            <input type="text" placeholder="Exact Correct Answer" required className="w-full text-xs border border-gray-200 p-1.5 rounded outline-none"
                              value={q.correctAnswer} onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsTestModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg">Save Assessment</button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --- BULK UPLOAD MODAL --- */}
      <Transition appear show={isBulkModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsBulkModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold text-gray-900 mb-4">
                  Bulk Import Assessment
                </Dialog.Title>

                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Course</label>
                    <select required className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                      value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
                      <option value="">Select Course...</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                      <select className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                        value={testType} onChange={e => setTestType(e.target.value)}>
                        <option value="QUIZ">Quiz (MCQ)</option>
                        <option value="EMAIL_SIMULATOR">Simulator</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                       <input type="text" required className="w-full border-gray-300 border p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-brand-500"
                        value={testTitle} onChange={e => setTestTitle(e.target.value)} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Spreadsheet (CSV/Excel)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 relative cursor-pointer">
                      <UploadCloud size={32} className="text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-600">Drag file or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Headers required: Question, Options, CorrectAnswer</p>
                      <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => setBulkFile(e.target.files[0])}
                        required
                      />
                    </div>
                    {bulkFile && <p className="mt-2 text-xs font-bold text-emerald-600 text-center">{bulkFile.name}</p>}
                  </div>

                  <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsBulkModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button type="submit" disabled={!bulkFile} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg disabled:opacity-50">Upload & Create</button>
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

export default TestManagement;
