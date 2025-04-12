import React, { useState, useEffect } from 'react';
import { getStudentAttendanceHistory } from '../services/api';

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedMonth, setExpandedMonth] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getStudentAttendanceHistory();
      setHistory(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandMonth = (index) => {
    setExpandedMonth(expandedMonth === index ? null : index);
  };

  const getMonthName = (month) => {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#4caf50';
      case 'absent': return '#f44336';
      case 'leave': return '#ff9800';
      default: return '#e0e0e0';
    }
  };

  if (loading) {
    return <div>Loading history...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (history.length === 0) {
    return <div>No attendance history found.</div>;
  }

  return (
    <div>
      {history.map((month, index) => (
        <div 
          key={`${month.month}-${month.year}`}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            marginBottom: '1rem',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div 
            style={{
              padding: '1rem',
              borderBottom: expandedMonth === index ? '1px solid #ddd' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => toggleExpandMonth(index)}
          >
            <h3 style={{ margin: 0 }}>
              {getMonthName(month.month)} {month.year}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '1rem' }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#4caf50',
                  marginRight: '5px',
                  borderRadius: '50%'
                }}></span>
                Present: {month.present}
              </div>
              
              <div style={{ marginRight: '1rem' }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#f44336',
                  marginRight: '5px',
                  borderRadius: '50%'
                }}></span>
                Absent: {month.absent}
              </div>
              
              <div style={{ marginRight: '1rem' }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ff9800',
                  marginRight: '5px',
                  borderRadius: '50%'
                }}></span>
                Leave: {month.leave}
              </div>
              
              <i className={`fas ${expandedMonth === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
          </div>
          
          {expandedMonth === index && (
            <div style={{ padding: '1rem' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '0.5rem',
                      borderBottom: '1px solid #ddd'
                    }}>Date</th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '0.5rem',
                      borderBottom: '1px solid #ddd'
                    }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {month.records.map(record => (
                    <tr key={record.id}>
                      <td style={{ 
                        padding: '0.5rem',
                        borderBottom: '1px solid #ddd'
                      }}>
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td style={{ 
                        padding: '0.5rem',
                        borderBottom: '1px solid #ddd'
                      }}>
                        <span style={{
                          backgroundColor: getStatusColor(record.status),
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          textTransform: 'capitalize'
                        }}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttendanceHistory;