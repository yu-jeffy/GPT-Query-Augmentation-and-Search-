document.getElementById('query-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
  
    // Send the query to the backend to be rewritten and searched
    fetch('/rewrite-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `query=${encodeURIComponent(query)}`,
    })
    .then(response => response.json())
    .then(data => {
      // Display the rewritten query
      document.getElementById('rewritten-query').textContent = data.rewritten_query;
  
      // Display the top 5 Google Search results
      const searchResultsDiv = document.getElementById('search-results');
      searchResultsDiv.innerHTML = '<h2>Top 5 Search Results:</h2>';
      data.search_results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `
          <p><strong>Title:</strong> ${result.title}</p>
          <p><strong>Snippet:</strong> ${result.snippet}</p>
          <p><strong>Link:</strong> <a href="${result.link}" target="_blank">${result.link}</a></p>
        `;
        searchResultsDiv.appendChild(resultElement);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });