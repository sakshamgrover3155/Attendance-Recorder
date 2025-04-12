const { readJsonFile, writeJsonFile } = require('../utils/fileUtils');
const fs = require('fs').promises;
const path = require('path');

// Get current month for student to mark attendance
const getCurrentMonthAttendance = async (req, res) => {
  try {
    const { id } = req.user;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const attendance = await readJsonFile('attendance.json');
    
    // Get all days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Find student's attendance records for current month
    const studentMonthRecords = attendance.records.filter(
      record => record.studentId === id && 
                new Date(record.date).getMonth() === currentMonth &&
                new Date(record.date).getFullYear() === currentYear
    );
    
    // Format days with attendance status
    const daysWithStatus = monthDays.map(day => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = studentMonthRecords.find(r => r.date === dateStr);
      
      return {
        day,
        date: dateStr,
        status: record ? record.status : null
      };
    });
    
    res.json({
      month: currentMonth + 1,
      year: currentYear,
      days: daysWithStatus
    });
  } catch (error) {
    console.error('Get current month attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark attendance for a specific date
const markAttendance = async (req, res) => {
  try {
    const { id, name } = req.user;
    const { date, status } = req.body;
    
    if (!date || !status) {
      return res.status(400).json({ message: 'Please provide date and status' });
    }
    
    const attendance = await readJsonFile('attendance.json');
    
    // Check if record already exists
    const existingRecordIndex = attendance.records.findIndex(
      record => record.studentId === id && record.date === date
    );
    
    if (existingRecordIndex !== -1) {
      // Update existing record
      attendance.records[existingRecordIndex].status = status;
      attendance.records[existingRecordIndex].updatedAt = new Date().toISOString();
    } else {
      // Create new record
      attendance.records.push({
        id: `att_${Date.now()}`,
        studentId: id,
        studentName: name,
        date,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    await writeJsonFile('attendance.json', attendance);
    
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's attendance history
const getStudentAttendanceHistory = async (req, res) => {
  try {
    const { id } = req.user;
    
    const attendance = await readJsonFile('attendance.json');
    
    // Get student's records
    const studentRecords = attendance.records.filter(record => record.studentId === id);
    
    // Group by month and year
    const groupedByMonth = {};
    
    studentRecords.forEach(record => {
      const date = new Date(record.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }
      
      groupedByMonth[monthYear].push(record);
    });
    
    // Format response
    const history = Object.keys(groupedByMonth).map(monthYear => {
      const [year, month] = monthYear.split('-');
      const records = groupedByMonth[monthYear];
      
      // Calculate statistics
      const presentCount = records.filter(r => r.status === 'present').length;
      const absentCount = records.filter(r => r.status === 'absent').length;
      const leaveCount = records.filter(r => r.status === 'leave').length;
      
      return {
        month: parseInt(month),
        year: parseInt(year),
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        total: records.length,
        records: records.sort((a, b) => new Date(a.date) - new Date(b.date))
      };
    });
    
    res.json(history);
  } catch (error) {
    console.error('Get student attendance history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students' attendance (for teachers)
const getAllStudentsAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Default to current month if not specified
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    
    const attendance = await readJsonFile('attendance.json');
    const users = await readJsonFile('users.json');
    
    // Get all students
    const students = users.students;
    
    // Filter records for the specified month and year
    const monthRecords = attendance.records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === targetMonth && 
             recordDate.getFullYear() === targetYear;
    });
    
    // Group records by student
    const studentAttendance = students.map(student => {
      const studentRecords = monthRecords.filter(record => record.studentId === student.id);
      
      // Calculate statistics
      const presentCount = studentRecords.filter(r => r.status === 'present').length;
      const absentCount = studentRecords.filter(r => r.status === 'absent').length;
      const leaveCount = studentRecords.filter(r => r.status === 'leave').length;
      
      return {
        id: student.id,
        name: student.name,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        total: studentRecords.length,
        attendanceRate: studentRecords.length > 0 ? 
          (presentCount / studentRecords.length * 100).toFixed(2) + '%' : 'N/A',
        records: studentRecords.sort((a, b) => new Date(a.date) - new Date(b.date))
      };
    });
    
    res.json({
      month: targetMonth + 1,
      year: targetYear,
      students: studentAttendance
    });
  } catch (error) {
    console.error('Get all students attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentMonthAttendance,
  markAttendance,
  getStudentAttendanceHistory,
  getAllStudentsAttendance
};