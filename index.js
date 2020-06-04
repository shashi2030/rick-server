var express = require('express');
var bodyParser = require('body-parser');
var app = express(); 
var mongoose = require('mongoose');


var seedDataIfNotExists = require('./seedingData')
var routes = require('./routes')
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); 

var config = require('./config');

var port = process.env.PORT || 4000;
app.use('/assets', express.static(__dirname + '/public'));

 var url = config.getDBConnectionString();
mongoose.connect(url, function(err, db) {
    
  if (err) {
    console.log("Unable to connect to MongoDb server. Error: ", err);
  } else {
    console.log("Mongodb Connection established successfully");
    seedDataIfNotExists();
  }
});

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type, Authorization, Cache-Control"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    return next();
  }); 



app.get('/', (req, res) => {
    seedDataIfNotExists();
})

app.use('/', routes);

app.listen(port, ()=> {
    console.log(`App is running on the ${port} PORT`)
});