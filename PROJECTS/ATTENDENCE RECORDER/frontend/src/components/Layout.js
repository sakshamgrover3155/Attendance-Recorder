import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        backgroundColor: '#3f51b5',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>Attendance Recorder</h1>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '1rem' }}>
              <strong>{user.name}</strong> ({user.role})
            </span>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main style={{ 
        padding: '2rem',
        flex: 1,
        backgroundColor: '#f5f5f5' 
      }}>
        <h2 style={{ 
          marginTop: 0,
          marginBottom: '1.5rem',
          color: '#333'
        }}>{title}</h2>
        {children}
      </main>

      <footer style={{ 
        padding: '1rem',
        backgroundColor: '#3f51b5',
        color: 'white',
        textAlign: 'center'
      }}>
        © {new Date().getFullYear()} Attendance Recorder Application
      </footer>
    </div>
  );
};

export default Layout;