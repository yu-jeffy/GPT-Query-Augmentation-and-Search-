// server.js

// Import Express
const express = require('express');

// Import the OpenAI library
const OpenAI = require('openai');

// Import other libraries
const axios = require('axios');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Load the OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create a new instance of the OpenAI class with the API key
const openai = new OpenAI(OPENAI_API_KEY);

// Create an instance of Express
const app = express();

// Define the port
const PORT = process.env.PORT || 3000;

// Setup Express middleware to parse incoming JSON requests
app.use(express.json());

// Express middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Define a simple route for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the GPT Query Rewriting and Search application!');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`And... we're live! Server is running on port ${PORT}`);
});

// Route for query rewrite
app.post('/rewrite-query', async (req, res) => {
    try {
        const query = req.body.query; // Extract the query from the POST request's body

        // Call the OpenAI API to rewrite the query using a function like the one below
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    "role": "system",
                    "content": "You are a helpful assistant. Your task is to rewrite queries to make them more effective for a Google search."
                },
                {
                    "role": "user",
                    "content": `Rewrite the following query to make it more effective for a Google search: ${query}`
                }
            ],
        });

        const rewrittenQuery = completion.choices[0].message.content;

        // Perform Google Search with the rewritten query
        const searchResults = await performGoogleSearch(rewrittenQuery);

        // Send the rewritten query and search results back to the client
        res.json({ rewritten_query: rewrittenQuery, search_results: searchResults });
    } catch (error) {
        console.error("Error rewriting query or performing search:", error);
        res.status(500).send("Error while processing the query or performing search");
    }
});

// Function to perform Google Search
async function performGoogleSearch(query) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;
  
  try {
    const response = await axios.get(url);
    // Check if items exist in the response data
    if (response.data.items) {
      return response.data.items.slice(0, 5); // Return the top 5 results
    } else {
      // Handle the case where no search results are returned
      console.log('No search results found.');
      return []; // Return an empty array if no items are found
    }
  } catch (error) {
    console.error("Error performing Google Search:", error);
    throw error;
  }
}
