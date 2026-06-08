import React, { useState, useEffect, useContext } from 'react';
import { PlayCircle, CheckCircle, FileText, ChevronLeft, Award, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { fetchCourses } from '../services/lmsService';
import ScormPlayer from '../components/ScormPlayer';
import { useToast } from '../hooks/useToast';
import { cn } from '../components/layout/DashboardLayout';

function TraineeDashboard() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchCourses();
      setCourses(res.data || []);
    } catch (err) {
      toast.error('Failed to load assigned courses.');
    }
  };

  const handleContentComplete = () => {
    toast.success("Module marked as completed!");
  };

  if (!activeCourse) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Learning</h1>
          <p className="text-gray-500 mt-1">Pick up where you left off or start a new course.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <p className="text-gray-500 col-span-full">No courses assigned yet.</p>
          ) : (
            courses.map(course => (
              <div
                key={course.id}
                onClick={() => setActiveCourse(course)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group flex flex-col h-full"
              >
                <div className="h-40 bg-gradient-to-br from-brand-500 to-blue-600 relative p-6 flex flex-col justify-end">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                  <Award size={32} className="text-white/20 absolute top-4 right-4" />
                  <h3 className="text-white font-bold text-xl relative z-10 leading-tight line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                    {course.description || "A comprehensive learning path designed to elevate your skills."}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-sm font-medium mb-1.5">
                      <span className="text-gray-700">Overall Progress</span>
                      <span className="text-brand-600">45%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col -m-6">
      <div className="h-16 bg-slate-900 text-white px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => { setActiveCourse(null); setActiveContent(null); }} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
            <ChevronLeft size={20} /> <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <h2 className="font-bold truncate max-w-xl">{activeCourse.title}</h2>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-black">
        <div className="flex-1 flex flex-col relative">
          {!activeContent ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-950">
              <PlayCircle size={64} className="mb-4 opacity-50" />
              <p className="text-lg">Select a module from the curriculum to begin</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col bg-slate-950">
              <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center flex-shrink-0">
                <h3 className="font-semibold">{activeContent.fileName}</h3>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">
                  {activeContent.fileType}
                </span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                {activeContent.fileType === 'SCORM' ? (
                  <ScormPlayer contentUrl={activeContent.filePath} onComplete={handleContentComplete} />
                ) : activeContent.fileType === 'VIDEO' ? (
                  <video controls className="w-full h-full object-contain bg-black"><source src={activeContent.filePath} type="video/mp4" /></video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900 border-t border-slate-800">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p className="mb-4">Document available for viewing</p>
                    <a href={activeContent.filePath} target="_blank" rel="noreferrer" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition">Open Document</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 z-10 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h3 className="font-bold text-gray-900">Course Curriculum</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {activeCourse.contents?.length === 0 && <p className="px-4 py-4 text-sm text-gray-500 text-center">No modules uploaded yet.</p>}
              {activeCourse.contents?.map((content, idx) => {
                const isActive = activeContent?.id === content.id;
                return (
                  <button key={content.id} className={cn("w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-l-2", isActive ? "bg-brand-50 border-brand-600" : "hover:bg-gray-50 border-transparent")} onClick={() => setActiveContent(content)}>
                    <div className="mt-0.5">{isActive ? <PlayCircle size={18} className="text-brand-600" /> : <CheckCircle size={18} className="text-gray-300" />}</div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium leading-tight mb-1 break-words", isActive ? "text-brand-900" : "text-gray-700")}>{idx + 1}. {content.fileName}</p>
                      <p className="text-xs text-gray-500 font-medium">{content.fileType}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TraineeDashboard;
