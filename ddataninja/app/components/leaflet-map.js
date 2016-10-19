import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['leaflet-map'],
    didInsertElement() {
        this._super(...arguments);

        var map = L.map('map').fitWorld();

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        map.locate({setView: true, maxZoom: 16});

        function onLocationFound(e) {
            var radius = e.accuracy / 2;

//            L.marker(e.latlng).addTo(map)
//                .bindPopup("You are within " + radius + " meters from this point").openPopup();

            L.circle(e.latlng, radius).addTo(map);

            $.getJSON('assets/stations.json', function(data){
                data.forEach(function(station){
                    var dist=geolib.getDistance({'latitude': station.coordinates.x, 'longitude': station.coordinates.y}, {'latitude': e.latitude, 'longitude': e.longitude});
                    var currentDate=new Date();
                    if(dist<500){
                        $.getJSON('http://localhost:8081/connection', {'start': station.name, 'end': 'Tannenstrasse', 'time': currentDate}, function(data){
                            var trips=data.trips;
                            trips.some(function(trip){
                                var text='';
                                text=text+trip.nodes[0].line+'<br>'+trip.nodes[0].direction+'<br>departure: '+trip.departure+'<br>'+'arrival: '+trip.arrival+'<br>'+'duration: '+trip.duration+'<br><br>';

                                var newDate=new Date(currentDate.toString());
                                newDate.setHours(0);
                                newDate.setMinutes(0);
                                var split=trip.departure.split(':');
                                newDate.setHours(parseInt(split[0]));
                                newDate.setMinutes(parseInt(split[1]));
                                var deltaInMin=(newDate.getTime()-currentDate.getTime())/60000;
                                console.log(newDate);
                                console.log(currentDate);
                                console.log(deltaInMin);

                                if(deltaInMin>0){
                                    var color='red';
                                    if(deltaInMin>0&&deltaInMin*66.7*0.8>dist) {
                                        color='green';
                                    }
                                    else {
                                        if(deltaInMin>0&&deltaInMin*66.7>dist) {
                                            color='yellow';
                                        }
                                    }

                                    var marker = L.AwesomeMarkers.icon({
                                        icon: trip.nodes[0].mode=='Stadtbus'?'bus':'subway',
                                        markerColor: color,
                                        prefix: 'fa'
                                    });
                                    var marker=L.marker({'lat':station.coordinates.x, 'lng':station.coordinates.y}, {icon: marker}).addTo(map);
                                    marker.bindPopup(text);

                                    return true;
                                }
                            });

                        });
                    }
                });
            });
        }

        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            alert(e.message);
        }

        map.on('locationerror', onLocationError);
    }
});
