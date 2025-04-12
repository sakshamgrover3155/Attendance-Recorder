import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <StudentPage />
          </ProtectedRoute>
        } />
        <Route path="/teacher" element={
          <ProtectedRoute role="teacher">
            <TeacherPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;