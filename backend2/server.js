var express = require('express');
var app = express();
// Taken from: https://code.ciphertrick.com/2015/02/25/get-post-requests-in-node-js-using-express-4/
var bodyParser = require("body-parser");
var moment = require('moment-timezone')
var http=require('http')
var xpath = require('xpath'), dom = require('xmldom').DOMParser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/connection', function(req, res){
    var start_lng = parseFloat(req.query.start_lng);
    var start_lat = parseFloat(req.query.start_lat);
    var end_lng = parseFloat(req.query.end_lng);
    var end_lat = parseFloat(req.query.end_lat);
    var time=new Date();

    var requestData=''+
        '<?xml version="1.0" encoding="UTF-8"?>'+
        '<Trias version="1.0" xmlns="trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
        '<ServiceRequest>'+
            '<siri:RequestTimestamp>'+time.toISOString()+'</siri:RequestTimestamp>'+
            '<siri:RequestorRef>SEUS</siri:RequestorRef>'+
            '<RequestPayload>'+
                '<TripRequest>'+
                    '<Origin>'+
                        '<LocationRef>'+
                            '<GeoPosition>'+
                                '<Longitude>'+start_lng+'</Longitude>'+
                                '<Latitude>'+start_lat+'</Latitude>'+
//                                '<Longitude>13.751272</Longitude>'+
//                                '<Latitude>51.073372</Latitude>'+
                            '</GeoPosition>'+
                            '<LocationName>'+
                                '<Text></Text>'+
                            '</LocationName>'+
                        '</LocationRef>'+
                        '<DepArrTime>'+time.toISOString()+'</DepArrTime>'+
                    '</Origin>'+
                    '<Destination>'+
                        '<LocationRef>'+
                            '<GeoPosition>'+
                                '<Longitude>'+end_lng+'</Longitude>'+
                                '<Latitude>'+end_lat+'</Latitude>'+
//                                '<Longitude>13.733651</Longitude>'+
//                                '<Latitude>51.039059</Latitude>'+
                            '</GeoPosition>'+
                            '<LocationName>'+
                                '<Text></Text>'+
                            '</LocationName>'+
                        '</LocationRef>'+
                    '</Destination>'+
                    '<Params>'+
                        '<PtModeFilter></PtModeFilter>'+
                    '</Params>'+
                '</TripRequest>'+
            '</RequestPayload>'+
        '</ServiceRequest>'+
        '</Trias>';

    // An object of options to indicate where to post to
    var post_options = {
        host: 'trias.vvo-online.de',
        port: '9000',
        path: '/Middleware/Data/Trias',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(dvbres) {
        dvbres.setEncoding('utf8');
        let raw='';
        var result={};

        dvbres.on('data', (chunk) => raw += chunk);
        dvbres.on('end', () => {
            raw=raw.replace(/xmlns=\".*?\"/, '');
            var doc = new dom().parseFromString(raw); 

            result.trips=xpath.select("//Trip", doc).map(function(trip){
                var tripResult={};
                // Take just the connections between stations. Walks are defined in ContinuousLegs.
                tripResult.legs=xpath.select('TripLeg/TimedLeg', trip).map(function(leg){
                    return {
                        start: xpath.select('LegBoard/StopPointName/Text/text()', leg).toString(),
                        departure: xpath.select('LegBoard/ServiceDeparture/TimetabledTime/text()', leg).toString(),
                        end: xpath.select('LegAlight/StopPointName/Text/text()', leg).toString(),
                        arrival: xpath.select('LegAlight/ServiceArrival/TimetabledTime/text()', leg).toString(),
                        type: xpath.select('Service/Mode/PtMode/text()', leg).toString(),
                        line: xpath.select('Service/PublishedLineName/Text/text()', leg).toString(),
                        direction: xpath.select('Service/DestinationText/Text/text()', leg).toString().replace(/"/g, '').replace(/^ /, ''),
                    };
                });

                return tripResult;
            });

            res.json(result);
        });
    });

    // post the data
    post_req.write(requestData);
    post_req.end();


});

var port   = 8081;//process.env.PORT;
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
