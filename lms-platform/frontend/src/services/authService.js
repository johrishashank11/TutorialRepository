import axiosInstance from '../api/axiosInstance';

export const loginApi = async (username, password) => {
  return await axiosInstance.post('/auth/login', { username, password });
};

export const registerApi = async (username, password, role) => {
  return await axiosInstance.post('/auth/register', { username, password, role });
};
