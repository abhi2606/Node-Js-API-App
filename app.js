const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const querystring = require('querystring');

const app = express();
const port = 3000;

const clientId = '3MVG9WVXk15qiz1JL1sTtS57eZC6M2jds3TXcuAOmawZh1eyq7d.aUJe_FYpYBpiGEYHAILNGj5EkDpdusOw4';
const clientSecret = 'FEEBA31E2584AA6E7A13A51D7468EB7DBB51ED8173ABA12A1A1BB103CA6313AE';
//const callbackUrl = 'http://localhost:3000/callback';
const callbackUrl = 'https://node-js-api-app-production.up.railway.app/callback';
const loginUrl = 'https://login.salesforce.com';
const redirectUri = encodeURIComponent(callbackUrl);
const tokenUrl = `${loginUrl}/services/oauth2/token`;
const apiUrl1 = 'https://ntt-5a-dev-ed.develop.my.salesforce.com';


// Set view engine to EJS
app.set('view engine', 'ejs');

// API endpoint URL
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

let apiData = [];

// Make API request using axios
axios.get(apiUrl)
  .then(response => {
    apiData = response.data;
  })
  .catch(error => {
    console.error(error);
  });

// Define endpoint outside API request
app.get('/', (req, res) => {
  res.render('index', { data: apiData });
});

app.get('/login', (req, res) => {
    const authUrl = `${apiUrl1}/services/oauth2/authorize?`;
    const params = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
    };
    const url = authUrl + querystring.stringify(params);
    res.redirect(url);
  });

  app.get('/callback', (req, res) => {
    const code = req.query.code;
    const params = {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
    };
    axios.post(tokenUrl, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => {
      const token = response.data;
      const accessToken = token.access_token;
      const instanceUrl = token.instance_url;
      // Use accessToken to make API calls
      const apiEndpoint = `${instanceUrl}/services/data/v54.0/query/`;
      const apiHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      const apiParams = {
        'q': 'SELECT Id, Name FROM Account',
      };
      axios.get(apiEndpoint, {
        params: apiParams,
        headers: apiHeaders,
      })
      .then((apiResponse) => {
        console.log(apiResponse.data);
        res.send('Authenticated!');
      })
      .catch((apiError) => {
        console.error(apiError);
        res.status(500).send('Error');
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error');
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});