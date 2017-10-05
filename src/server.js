const persistence = require('./persistence');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const dbHost = '127.0.0.1';
const dbPort = 6379;

persistence.connect(dbHost, dbPort);
app.use(bodyParser.json());

app.post('/track', (req, res) => {
  persistence.storeInFile('./test.txt', req.body, (err, reply) => {
    if (err) {
      console.log(`Error in POST /track. ${err}`);
      res.status(409).end();
    } else {
      console.log('POST /track: Successfully stored data.');
      res.status(201).send(`${reply}`);
    }
  });
});

app.get('/count', (req, res) => {
  persistence.getValue('count', (err, reply) => {
    if (err) {
      console.log(`Error in GET /count. ${err}`);
      res.status(404).end();
    } else {
      // Lazy initialization of 'count'
      console.log(`GET /count: Successfully fetched count key -> ${reply || 0}`);
      res.status(200).send(`${reply || 0}`);
    }
  });
});

app.all('*', (req, res) => {
  res.status(403).end();
});

app.listen(8888);
