const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const salesforce = require('./salesforce');

const app = express();
const port = 3000;



// Set view engine to EJS
app.set('view engine', 'ejs');
app.use('/salesforce', salesforce);

// API endpoint URL
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

// Make API request using axios
axios.get(apiUrl)
  .then(response => {
    const data = response.data;

    // Render EJS template with API data
    app.get('/', (req, res) => {
      res.render('index', { data });
    });
  })
  .catch(error => {
    console.error(error);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});     