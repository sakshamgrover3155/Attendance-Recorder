const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const fs = require('fs');

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  const dataDir = path.join(__dirname, 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  const usersPath = path.join(dataDir, 'users.json');
  const attendancePath = path.join(dataDir, 'attendance.json');
  
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify({
      students: [
        { id: 's1', username: 'student1', password: '$2a$10$1IYvltHLCPulGSG3qLuPf.a9HJfBsxA6gzfz9ZnKoFNL5KSKxpbL2', name: 'Student One' }, // password: student1
        { id: 's2', username: 'student2', password: '$2a$10$RqR5Ql7VoZvb.Jn3N5Ee5OwzJOIIqyHyFvX8JxPsS.IC2wMKUeFbG', name: 'Student Two' }  // password: student2
      ],
      teachers: [
        { id: 't1', username: 'teacher1', password: '$2a$10$kNSXzM9Wrt3M1qJgYEeaPe8jk.Xs1qHDIkPWnv9Ky3eIsdwxXbRjy', name: 'Teacher One' } // password: teacher1
      ]
    }, null, 2));
  }
  
  if (!fs.existsSync(attendancePath)) {
    fs.writeFileSync(attendancePath, JSON.stringify({
      records: []
    }, null, 2));
  }
};

// Initialize the app
initializeDataFiles();
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
