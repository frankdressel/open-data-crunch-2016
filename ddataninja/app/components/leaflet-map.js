import Ember from 'ember';

export default Ember.Component.extend({
    targetService: Ember.inject.service(),
    // Change this. It should be in the router.
    store: Ember.inject.service(),
    classNames: ['leaflet-map'],
    didInsertElement() {
        this._super(...arguments);
        var store=this.get('store');

        var target=null;
        if(this.get('targetService').items.length>0){
            target=this.get('targetService').items[0];
        }

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

            $.getJSON('assets/VVO_Haltestellen_VVO_WGS84.json', function(data){
                console.log(data);
                var requestData={start_lng: e.longitude, start_lat: e.latitude, end_lng: target.longitude, end_lat: target.latitude}
                store.findRecord('full-trip', JSON.stringify(requestData)).then(function(tripRequest){
                    tripRequest.get('trips').some(function(trip){
                        var legs=trip.legs;
                        var start=(legs&&legs[0].start)||'';
                        var matchingStations=data.filter(function(station){
                            return station['Name mit Ort']==start;
                        });
                        if(matchingStations&&matchingStations.length>0){
                            var matchingStation=matchingStations[0];
                            var dist=geolib.getDistance({'latitude': parseFloat(matchingStation.WGS84_Y), 'longitude': parseFloat(matchingStation.WGS84_X)}, {'latitude': e.latitude, 'longitude': e.longitude});
                            if(dist/1.1<(new Date(legs[0].departure).getTime()-new Date().getTime())/1000){
                                var marker = L.AwesomeMarkers.icon({
                                    icon: legs[0].type=='bus'?'bus':'subway',
                                    markerColor: 'green',
                                    prefix: 'fa'
                                });

                                function info(leg){
                                    return leg.line+'('+leg.direction+'): '+leg.departure+'&rArr;'+leg.end;
                                }
                                var text=legs.map(function(leg){
                                    return info(leg);
                                }).reduce(function(previous, current){return previous+'<br>'+current;});

                                var marker=L.marker({'lat':parseFloat(matchingStation.WGS84_Y), 'lng':parseFloat(matchingStation.WGS84_X)}, {icon: marker}).addTo(map);
                                marker.bindPopup(text);

                                return true;
                            }
                        }
                    });
                });


//                data.forEach(function(station){
//                    var dist=geolib.getDistance({'latitude': station.coordinates.x, 'longitude': station.coordinates.y}, {'latitude': e.latitude, 'longitude': e.longitude});
//                    var currentDate=new Date();
//
//
//                    if(dist<500&&target){
//                        $.getJSON('https://lass-die-karre-stehen.mybluemix.net/connection', {'start': station.name, 'end': target, 'time': UTCDate}, function(data){
//                            var trips=data.trips;
//                            trips.some(function(trip){
//                                var text='';
//                                for(var i =0; i<trip.nodes.length; i++){
//                                    var node=trip.nodes[i];
//                                    var start=(i==0?' from '+node.departure.stop:'');
//                                    text=text+node.departure.time+': '+node.line+start+' ('+node.direction+') &rarr; '+node.arrival.stop+'<br>';
//                                }
//                                var lastNode=trip.nodes[trip.nodes.length-1];
//                                text=text+'<u>'+lastNode.arrival.time+'</u>: '+lastNode.arrival.stop;
//                                console.log(text);
//
//                                var split=trip.departure.split(':');
//                                var deltaInMin=0;
//                                var departurehour=parseInt(split[0]);
//                                var departureminute=parseInt(split[1]);
//                                var CurrentHour=currentDate.getHours();;
//
//
//                                if(CurrentHour>23&&departurehour<12){
//                                    departurehour=departurehour+24;
//                                }
//
//                                deltaInMin=(departurehour-CurrentHour)*60+departureminute-currentDate.getMinutes();
//
//                                console.log(deltaInMin);
//                                console.log(CurrentHour);
//
//                                if(deltaInMin>0&&deltaInMin<30&&deltaInMin*66.7*1.2>dist){
//                                    var color='red';
//                                    if(deltaInMin>0&&deltaInMin*66.7*0.8>dist) {
//                                        color='green';
//                                    }
//                                    else {
//                                        if(deltaInMin>0&&deltaInMin*66.7>dist) {
//                                            color='yellow';
//                                        }
//                                    }
//
//                                    var marker = L.AwesomeMarkers.icon({
//                                        icon: trip.nodes[0].mode=='Stadtbus'?'bus':'subway',
//                                        markerColor: color,
//                                        prefix: 'fa'
//                                    });
//                                    var marker=L.marker({'lat':station.coordinates.x, 'lng':station.coordinates.y}, {icon: marker}).addTo(map);
//                                    marker.bindPopup(text);
//
//                                    return true;
//                                }
//                            });
//
//                        });
//                    }
//                });
            });
        }

        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            alert(e.message);
        }

        map.on('locationerror', onLocationError);
    }
});
