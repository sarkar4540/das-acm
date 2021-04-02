var express = require('express');
var logger = require('morgan');

var glob = require('glob')
var os = require('os')
const fs = require('fs')


var app = express();

app.use(logger('dev'));
app.use(function (req, res, next) {
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    data += chunk;
  });

  req.on('end', function () {
    req.body = data;
    next();
  });
})

app.get('/device_session/:id', (req, res) => {
  list_of_files = glob.glob("data/" + req.params.id + "/*.csv") // means all if need specific format then *.csv
  file = (+ new Date())
  console.log(file)
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }
  if (!fs.existsSync('data/' + req.params.id)) {
    fs.mkdirSync('data/' + req.params.id)
  }
  fs.writeFileSync('data/' + req.params.id + '/' + file + ".csv", "")
  res.status(200).send(req.params.id + '/' + file);
})

app.post('/data', (req, res) => {
  file = 'data/' + (req.headers.device_session) + ".csv"
  console.log(file)
  if (fs.existsSync(file)) {
    //console.log(req.body);
    fs.appendFileSync(file, req.body)
  }
  else console.log("file not found")
  res.status(200).send(req.body.length + " characters");
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.sendStatus(404);
});


module.exports = app;
