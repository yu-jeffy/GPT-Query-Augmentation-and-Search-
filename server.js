// server.js

// Import the necessary libraries
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Define the port
const PORT = process.env.PORT || 3000;

// Setup Express middleware to parse incoming JSON requests
app.use(express.json());

// Define a simple route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the GPT Query Rewriting and Search application!');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`And.. we're live! Server is running on port ${PORT}`);
});