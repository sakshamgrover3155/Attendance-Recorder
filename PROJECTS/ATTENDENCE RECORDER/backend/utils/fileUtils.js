
// File: utils/fileUtils.js
const fs = require('fs').promises;
const path = require('path');

// Utility functions for file operations
const readJsonFile = async (filename) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read ${filename}`);
  }
};

const writeJsonFile = async (filename, data) => {
  try {
    await fs.writeFile(
      path.join(__dirname, '../data', filename),
      JSON.stringify(data, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    throw new Error(`Failed to write to ${filename}`);
  }
};

module.exports = {
  readJsonFile,
  writeJsonFile
};

