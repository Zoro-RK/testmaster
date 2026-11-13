import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen fullScreen={true} />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function StandaloneProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen fullScreen={true} />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen fullScreen={true} />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <AuthLayout>{children}</AuthLayout>;
}

export default function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Standalone Interactive Examination Engine (No sidebar focus mode) */}
      <Route path="/exam/attempt/:attemptId" element={<StandaloneProtectedRoute><ExamPage /></StandaloneProtectedRoute>} />

      {/* Protected App Routes inside persistent AppLayout (Sidebar stays mounted across all sections) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friends/:userId" element={<FriendProfilePage />} />
        <Route path="/syllabus" element={<SyllabusPage />} />
        <Route path="/syllabus/topics/:topicId" element={<TopicDetailPage />} />
        <Route path="/portions" element={<MyPortionsPage />} />
        <Route path="/tests" element={<TestLibraryPage />} />
        <Route path="/tests/upload" element={<UploadTestPage />} />
        <Route path="/tests/my" element={<MyTestsPage />} />
        <Route path="/tests/:testId" element={<TestDetailPage />} />
        <Route path="/exam/result/:attemptId" element={<ExamResultPage />} />
        <Route path="/progress" element={<MyProgressPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

