import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    // Continuing from previous code in LoginForm.js
}

try {
  setLoading(true);
  const userData = await loginUser({ username, password, role });
  login(userData);
  navigate(`/${role}`);
} catch (err) {
  setError(err.response?.data?.message || 'Login failed. Please try again.');
} finally {
  setLoading(false);
}
};

return (
<div style={{
  maxWidth: '400px',
  margin: '0 auto',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
}}>
  <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
  
  {error && (
    <div style={{
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '0.75rem',
      marginBottom: '1rem',
      borderRadius: '4px'
    }}>
      {error}
    </div>
  )}
  
  <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: '1rem' }}>
      <label 
        htmlFor="username"
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}
      >
        Username
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      />
    </div>
    
    <div style={{ marginBottom: '1rem' }}>
      <label 
        htmlFor="password"
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      />
    </div>
    
    <div style={{ marginBottom: '1.5rem' }}>
      <label 
        htmlFor="role"
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}
      >
        Role
      </label>
      <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
    </div>
    
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#3f51b5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>
  
  <div style={{ 
    marginTop: '1rem', 
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#666'
  }}>
    <p>Student accounts: student1/student1, student2/student2</p>
    <p>Teacher account: teacher1/teacher1</p>
  </div>
</div>
);
};

export default LoginForm;