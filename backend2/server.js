var express = require('express');
var app = express();
var dvb = require('dvbjs');
// Taken from: https://code.ciphertrick.com/2015/02/25/get-post-requests-in-node-js-using-express-4/
var bodyParser = require("body-parser");
var moment = require('moment-timezone')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/connection', function(req, res){
    var origin = req.query.start;
    var destination = req.query.end;
    console.log(req.query.time);
    var time=new Date(req.query.time);
    console.log(time);
//g    console.log(destination);
//g    res.end();

    var deparr = dvb.route.DEPARTURE; // set to dvb.route.DEPARTURE for the time to be the departure time, dvb.route.ARRIVAL for arrival time

    dvb.route(origin, destination, time, deparr, function(err, data) {
        if (err) {
            res.status(500);
            res.end(err);
        }
        res.end(JSON.stringify(data, null, 4));
    });
})

var port   = process.env.PORT;
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})