const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readJsonFile } = require('../utils/fileUtils');

const JWT_SECRET = 'attendanceapp2025secret'; // In production, use environment variables for secrets

// Login controller
const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Please provide username, password and role' });
    }
    
    const users = await readJsonFile('users.json');
    
    // Check if user exists based on role
    const userList = role === 'student' ? users.students : users.teachers;
    const user = userList.find(u => u.username === username);
    
    if (!user) {
        console.error('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    console.error('User not found:isMatch', isMatch , user);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };