import React, { useState } from 'react';
import AttendanceCalendar from './AttendanceCalendar';
import AttendanceHistory from './AttendanceHistory';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div>
      <div style={{
        display: 'flex',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #ddd'
      }}>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'calendar' ? '#666' : 'transparent',
            color: activeTab === 'calendar' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'calendar' ? '3px solid #666' : 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'cursive'
          }}
          onClick={() => setActiveTab('calendar')}
        >
          Current Month
        </button>
        
        <button
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'history' ? '#666' : 'transparent',
            color: activeTab === 'history' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'history' ? '3px solid #666' : 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'cursive'
          }}
          onClick={() => setActiveTab('history')}
        >
          Attendance History
        </button>
      </div>
      
      {activeTab === 'calendar' ? <AttendanceCalendar /> : <AttendanceHistory />}
    </div>
  );
};

export default StudentDashboard;