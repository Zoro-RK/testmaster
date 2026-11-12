import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LoadingScreen from './components/common/LoadingScreen';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import FriendsPage from './pages/friends/FriendsPage';
import FriendProfilePage from './pages/friends/FriendProfilePage';
import SyllabusPage from './pages/syllabus/SyllabusPage';
import TopicDetailPage from './pages/syllabus/TopicDetailPage';
import MyPortionsPage from './pages/portions/MyPortionsPage';
import TestLibraryPage from './pages/tests/TestLibraryPage';
import TestDetailPage from './pages/tests/TestDetailPage';
import UploadTestPage from './pages/tests/UploadTestPage';
import MyTestsPage from './pages/tests/MyTestsPage';
import ExamPage from './pages/examination/ExamPage';
import ExamResultPage from './pages/examination/ExamResultPage';
import MyProgressPage from './pages/progress/MyProgressPage';
import MaterialsPage from './pages/materials/MaterialsPage';
import SettingsPage from './pages/settings/SettingsPage';

function ProtectedRoute({ children, standalone = false }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (standalone) return children;
  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <AuthLayout>{children}</AuthLayout>;
}

export default function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected App Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
      <Route path="/friends/:userId" element={<ProtectedRoute><FriendProfilePage /></ProtectedRoute>} />
      <Route path="/syllabus" element={<ProtectedRoute><SyllabusPage /></ProtectedRoute>} />
      <Route path="/syllabus/topics/:topicId" element={<ProtectedRoute><TopicDetailPage /></ProtectedRoute>} />
      <Route path="/portions" element={<ProtectedRoute><MyPortionsPage /></ProtectedRoute>} />
      <Route path="/tests" element={<ProtectedRoute><TestLibraryPage /></ProtectedRoute>} />
      <Route path="/tests/upload" element={<ProtectedRoute><UploadTestPage /></ProtectedRoute>} />
      <Route path="/tests/my" element={<ProtectedRoute><MyTestsPage /></ProtectedRoute>} />
      <Route path="/tests/:testId" element={<ProtectedRoute><TestDetailPage /></ProtectedRoute>} />
      
      {/* Interactive Examination Engine (Standalone focus shell) */}
      <Route path="/exam/attempt/:attemptId" element={<ProtectedRoute standalone={true}><ExamPage /></ProtectedRoute>} />
      <Route path="/exam/result/:attemptId" element={<ProtectedRoute><ExamResultPage /></ProtectedRoute>} />

      <Route path="/progress" element={<ProtectedRoute><MyProgressPage /></ProtectedRoute>} />
      <Route path="/materials" element={<ProtectedRoute><MaterialsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

