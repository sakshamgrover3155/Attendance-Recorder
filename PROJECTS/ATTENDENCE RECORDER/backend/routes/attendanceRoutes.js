const express = require('express');
const { 
  getCurrentMonthAttendance,
  markAttendance, 
  getStudentAttendanceHistory,
  getAllStudentsAttendance
} = require('../controllers/attendanceController');
const { protect, isTeacher, isStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Student routes
router.get('/current-month', protect, isStudent, getCurrentMonthAttendance);
router.post('/mark', protect, isStudent, markAttendance);
router.get('/history', protect, isStudent, getStudentAttendanceHistory);

// Teacher routes
router.get('/all-students', protect, isTeacher, getAllStudentsAttendance);

module.exports = router;