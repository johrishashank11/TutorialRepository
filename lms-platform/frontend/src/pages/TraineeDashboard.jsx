import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ScormPlayer from '../components/ScormPlayer';
import { LogOut, PlayCircle, CheckCircle, FileText } from 'lucide-react';

function TraineeDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeContent, setActiveContent] = useState(null);

  useEffect(() => {
    // For PoC, fetch all courses. In reality, fetch only assigned courses.
    fetchAssignedCourses();
  }, []);

  const fetchAssignedCourses = async () => {
    try {
      const res = await api.get('/lms/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContentComplete = () => {
    alert("Module marked as completed!");
    // Logic to update backend progress here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">My Learning (Trainee View)</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="flex items-center gap-2 hover:text-emerald-200 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Course List (Left Sidebar) */}
        <div className="lg:col-span-1 bg-white rounded shadow p-4 border border-gray-200 h-fit">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Assigned Courses</h2>
          <div className="space-y-4">
            {courses.length === 0 ? <p className="text-gray-500">No courses assigned.</p> :
              courses.map(course => (
                <div
                  key={course.id}
                  className={`p-4 rounded cursor-pointer transition border-l-4 ${activeCourse?.id === course.id ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                  onClick={() => setActiveCourse(course)}
                >
                  <h3 className="font-semibold text-gray-800">{course.title}</h3>

                  {/* Fake Progress Bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 inline-block">45% Completed</span>
                </div>
            ))}
          </div>
        </div>

        {/* Course Content Player (Main Area) */}
        <div className="lg:col-span-2 bg-white rounded shadow p-6 border border-gray-200 flex flex-col">
          {!activeCourse ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
              <PlayCircle size={64} />
              <p>Select a course to start learning</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">{activeCourse.title}</h2>
              <p className="text-gray-600 mb-6">{activeCourse.description}</p>

              {/* Content Player / Viewer */}
              <div className="mb-8">
                {activeContent ? (
                  activeContent.fileType === 'SCORM' ? (
                    <ScormPlayer contentUrl={activeContent.filePath} onComplete={handleContentComplete} />
                  ) : activeContent.fileType === 'VIDEO' ? (
                    <video controls className="w-full rounded bg-black max-h-[500px]">
                      <source src={activeContent.filePath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="border p-12 text-center bg-gray-50 rounded flex flex-col items-center gap-4">
                      <FileText size={48} className="text-gray-400" />
                      <p>Document Viewer: <a href={activeContent.filePath} target="_blank" rel="noreferrer" className="text-blue-500 underline">{activeContent.fileName}</a></p>
                    </div>
                  )
                ) : (
                   <div className="border p-12 text-center bg-gray-50 rounded text-gray-500">
                     Select a module below to view.
                   </div>
                )}
              </div>

              {/* Module List */}
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Course Modules & Assessments</h3>
              <ul className="space-y-2">
                {activeCourse.contents?.map((content, idx) => (
                  <li
                    key={content.id}
                    className={`flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50 transition ${activeContent?.id === content.id ? 'border-emerald-500 bg-emerald-50' : ''}`}
                    onClick={() => setActiveContent(content)}
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle size={20} className={activeContent?.id === content.id ? 'text-emerald-500' : 'text-gray-400'} />
                      <span className="font-medium text-gray-700">Module {idx + 1}: {content.fileName}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{content.fileType}</span>
                    </div>
                    <CheckCircle size={20} className="text-gray-300" /> {/* Grey when incomplete */}
                  </li>
                ))}

                {/* Fake test link */}
                <li className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-red-50 transition border-red-200">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-red-400" />
                      <span className="font-medium text-red-700">Final Assessment</span>
                    </div>
                    <span className="text-xs font-bold text-red-600">Pending</span>
                  </li>
              </ul>
            </>
          )}
        </div>

      </main>
    </div>
  );
}

export default TraineeDashboard;
