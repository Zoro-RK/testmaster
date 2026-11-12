import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('tnpsc_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setUser(res.user);
        setGroup(res.group);
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('tnpsc_token');
        setUser(null);
        setGroup(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('tnpsc_token', res.token);
    setUser(res.user);
    setGroup(res.group);
    return res;
  };

  const register = async (displayName, email, password, invitationCode) => {
    const res = await api.register({ displayName, email, password, invitationCode });
    localStorage.setItem('tnpsc_token', res.token);
    setUser(res.user);
    setGroup(res.group);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('tnpsc_token');
    setUser(null);
    setGroup(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
      setGroup(res.group);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, group, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

