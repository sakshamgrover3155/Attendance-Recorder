import React, { useState, useEffect } from 'react';
import { getCurrentMonthAttendance, markAttendance } from '../services/api';

const AttendanceCalendar = () => {
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMonthData();
  }, []);

  const fetchMonthData = async () => {
    try {
      setLoading(true);
      const data = await getCurrentMonthAttendance();
      setMonthData(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (date, status) => {
    try {
      setLoading(true);
      await markAttendance({ date, status });
      setMessage(`Attendance marked as "${status}" for ${date}`);
      // Refresh data
      await fetchMonthData();
    } catch (err) {
      setError('Failed to mark attendance');
      console.error(err);
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#4caf50';
      case 'absent': return '#f44336';
      case 'leave': return '#ff9800';
      default: return '#e0e0e0';
    }
  };

  if (loading && !monthData) {
    return <div>Loading calendar...</div>;
  }

  if (error && !monthData) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h3>
        {new Date(monthData.year, monthData.month - 1).toLocaleString('default', { month: 'long' })} {monthData.year}
      </h3>
      
      {message && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '0.75rem',
          marginBottom: '1rem',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      
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
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        marginBottom: '2rem'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '0.5rem',
            backgroundColor: '#f0f0f0'
          }}>
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before first day of month */}
        {Array.from({ length: new Date(monthData.year, monthData.month - 1, 1).getDay() }).map((_, index) => (
          <div key={`empty-start-${index}`} style={{ padding: '0.5rem' }}></div>
        ))}
        
        {/* Calendar days */}
        {monthData.days.map((day) => {
          const date = new Date();
          const isToday = date.getDate() === day.day && 
                          date.getMonth() === monthData.month - 1 && 
                          date.getFullYear() === monthData.year;
          const isPast = new Date(day.date) < new Date(new Date().setHours(0, 0, 0, 0));
          
          return (
            <div 
              key={day.day}
              style={{
                padding: '0.5rem',
                border: isToday ? '2px solid #666' : '1px solid #ddd',
                backgroundColor: 'white',
                position: 'relative'
              }}
            >
              <div style={{ 
                fontWeight: isToday ? 'bold' : 'normal',
                textAlign: 'center',
                marginBottom: '0.5rem'
              }}>
                {day.day}
              </div>
              
              {day.status ? (
                <div style={{
                  backgroundColor: getStatusColor(day.status),
                  color: 'white',
                  padding: '0.25rem',
                  textAlign: 'center',
                  borderRadius: '4px',
                  textTransform: 'capitalize'
                }}>
                  {day.status}
                </div>
              ) : isPast ? (
                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => handleMarkAttendance(day.date, 'present')} style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    margin: '0.1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>Present</button>
                  <button onClick={() => handleMarkAttendance(day.date, 'absent')} style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    margin: '0.1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>Absent</button>
                  <button onClick={() => handleMarkAttendance(day.date, 'leave')} style={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    margin: '0.1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>Leave</button>
                </div>
              ) : (
                <div style={{
                  color: '#999',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  Future date
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;