import axiosInstance from '../api/axiosInstance';

// Processes
export const fetchProcesses = () => axiosInstance.get('/lms/processes');

// Batches
export const fetchBatches = () => axiosInstance.get('/lms/batches');
export const uploadBatchesBulk = (formData) => axiosInstance.post('/lms/bulk-upload/batches', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Courses
export const fetchCourses = () => axiosInstance.get('/lms/courses');
export const createCourse = (course) => axiosInstance.post('/lms/courses', course);
export const updateCourse = (id, course) => axiosInstance.put(`/lms/courses/${id}`, course);
export const uploadCourseContent = (courseId, formData) => axiosInstance.post(`/lms/courses/${courseId}/contents`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const assignBatchToCourse = (batchId, courseId) => axiosInstance.post(`/lms/batches/${batchId}/courses/${courseId}`);

// Assessments
export const fetchTests = () => axiosInstance.get('/lms/assessments/tests');
export const createManualTest = (courseId, payload) => axiosInstance.post(`/lms/assessments/courses/${courseId}/tests`, payload);
export const uploadBulkTest = (courseId, formData) => axiosInstance.post(`/lms/assessments/courses/${courseId}/tests/upload`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
