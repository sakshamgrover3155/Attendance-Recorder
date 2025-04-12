// Import the required libraries
const express = require('express');
const fs = require('fs'); // Import the fs module
const path = require('path'); // Import path module for file path handling

// Create an instance of an Express application
const app = express();

// Define the port number where the server will listen for requests
const PORT = process.env.PORT || 3000; // If there's a PORT in the environment, use it; otherwise, use 3000

// Middleware to capture request details
app.use((req, res, next) => {
    // Get the current timestamp
    const timestamp = new Date().toISOString();
    
    // Get the client's IP address
    const ipAddress = req.ip;
    
    // Get the requested URL
    const url = req.originalUrl;
    
    // Get the protocol (HTTP or HTTPS)
    const protocol = req.protocol;
    
    // Get the HTTP method (GET, POST, etc.)
    const httpMethod = req.method;
    
    // Get the hostname
    const hostname = req.hostname;

    // Create a log entry as a JSON object
    const logEntry = {
        timestamp,
        ipAddress,
        url,
        protocol,
        httpMethod,
        hostname
    };

    // Convert the log entry to a JSON string
    const logEntryString = JSON.stringify(logEntry);

    // Append the log entry to the requests.log file
    fs.appendFile(path.join(__dirname, 'requests.log'), logEntryString + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });

    // Call the next middleware or route handler
    next();
});

// Create a basic route that responds to GET requests at the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!'); // Send a simple message back to the client
});

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log a message to the console
});