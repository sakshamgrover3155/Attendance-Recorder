import React, { useState, useEffect } from 'react';
import { getAllStudentsAttendance } from '../services/api';

const AllStudentsAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [year, setYear] = useState(new Date().getFullYear());
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, [month, year]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const data = await getAllStudentsAttendance(month, year);
      setAttendanceData(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandStudent = (index) => {
    setExpandedStudent(expandedStudent === index ? null : index);
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

  if (loading && !attendanceData) {
    return <div>Loading attendance data...</div>;
  }

  if (error && !attendanceData) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ margin: 0 }}>
          Students Attendance: {getMonthName(attendanceData?.month)} {attendanceData?.year}
        </h3>
        
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '1rem' }}>
            <label htmlFor="month" style={{ marginRight: '0.5rem' }}>Month:</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="year" style={{ marginRight: '0.5rem' }}>Year:</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {attendanceData?.students.length === 0 ? (
        <div>No attendance records found for this month.</div>
      ) : (
        <div>
          {attendanceData?.students.map((student, index) => (
            <div 
              key={student.id}
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
                  borderBottom: expandedStudent === index ? '1px solid #ddd' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => toggleExpandStudent(index)}
              >
                <h4 style={{ margin: 0 }}>
                  {student.name}
                </h4>
                
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
                    Present: {student.present}
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
                    Absent: {student.absent}
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
                    Leave: {student.leave}
                  </div>
                  
                  <div style={{ marginRight: '1rem' }}>
                    Attendance Rate: {student.attendanceRate}
                  </div>
                  
                  <i className={`fas ${expandedStudent === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
              </div>
              
              {expandedStudent === index && (
                <div style={{ padding: '1rem' }}>
                  {student.records.length === 0 ? (
                    <div>No records for this month.</div>
                  ) : (
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
                        {student.records.map(record => (
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
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllStudentsAttendance;