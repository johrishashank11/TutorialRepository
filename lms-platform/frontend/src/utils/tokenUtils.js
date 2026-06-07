import { jwtDecode } from 'jwt-decode';

export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const setRole = (role) => localStorage.setItem('role', role);
export const getRole = () => localStorage.getItem('role');
export const removeRole = () => localStorage.removeItem('role');

export const setUserId = (userId) => localStorage.setItem('userId', userId);
export const getUserId = () => localStorage.getItem('userId');
export const removeUserId = () => localStorage.removeItem('userId');

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (err) {
        return true;
    }
};

export const clearAuth = () => {
    removeToken();
    removeRole();
    removeUserId();
};
