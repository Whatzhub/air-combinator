var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var Scraper = require('./scraper');

app.use(express.static('dist/'));
app.use(bodyParser.json());

// Express Api Paths
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/search', (req, res) => {
  let reqBody = req.body;
  console.log(reqBody);
  Scraper.scrape(reqBody)
    .then(csvData => {
      console.log(csvData);
      console.log('Success! Returning csv file response to client.');
      
      let fileName = 'allOTAs.csv';
      let file = __dirname + '/csv/' + fileName;
      res.download(file);
    })
    .catch(err => console.log(22, err));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});
