import React, { createContext, useState, useEffect } from 'react';
import { getToken, getRole, getUserId, isTokenExpired, setToken, setRole, setUserId, clearAuth } from '../utils/tokenUtils';
import { loginApi } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    const userId = getUserId();

    if (token && role) {
      if (isTokenExpired(token)) {
        clearAuth();
      } else {
        // Mock decoding username for UX purposes
        setUser({ username: role.replace('ROLE_', '').toLowerCase(), role, userId });
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await loginApi(username, password);
    const { token, role, userId } = res.data;
    setToken(token);
    setRole(role);
    setUserId(userId);
    setUser({ username, role, userId });
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
