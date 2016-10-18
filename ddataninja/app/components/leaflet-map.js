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
                    if(geolib.getDistance({'latitude': station.coordinates.x, 'longitude': station.coordinates.y}, {'latitude': e.latitude, 'longitude': e.longitude})<500){
                        var marker=L.marker({'lat':station.coordinates.x, 'lng':station.coordinates.y}).addTo(map);
                        $.getJSON('http://localhost:8081/connection', {'start': station.name, 'end': 'Tannenstrasse'}, function(data){
                            var text='';
                            data.trips.forEach(function(trip){
                                text=text+trip.nodes[0].line+'<br>'+trip.nodes[0].direction+'<br>departure: '+trip.departure+'<br>'+'arrival: '+trip.arrival+'<br>'+'duration: '+trip.duration+'<br><br>';
                            });
                            marker.bindPopup(text);
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
