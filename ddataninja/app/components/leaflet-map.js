import Ember from 'ember';

export default Ember.Component.extend({
    targetService: Ember.inject.service(),
    classNames: ['leaflet-map'],
    didInsertElement() {
        this._super(...arguments);

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

            $.getJSON('assets/stations.json', function(data){
                data.forEach(function(station){
                    var dist=geolib.getDistance({'latitude': station.coordinates.x, 'longitude': station.coordinates.y}, {'latitude': e.latitude, 'longitude': e.longitude});
                    var currentDate=new Date();
		    var UTCDate= new Date(currentDate);
		    
		    UTCDate.setHours(currentDate.getHours() + 2);
 
                    if(dist<500&&target){
                        $.getJSON('https://lass-die-karre-stehen.mybluemix.net/connection', {'start': station.name, 'end': target, 'time': UTCDate}, function(data){
                            var trips=data.trips;
                            trips.some(function(trip){
                                var text='';
                                for(var i =0; i<trip.nodes.length; i++){
                                    var node=trip.nodes[i];
                                    var start=(i==0?' from '+node.departure.stop:'');
                                    text=text+node.departure.time+': '+node.line+start+' ('+node.direction+') &rarr; '+node.arrival.stop+'<br>';
                                }
                                var lastNode=trip.nodes[trip.nodes.length-1];
                                text=text+'<u>'+lastNode.arrival.time+'</u>: '+lastNode.arrival.stop;
                                console.log(text);

                                var split=trip.departure.split(':');
                                var deltaInMin=0;
                                var departurehour=parseInt(split[0]);
				var departureminute=parseInt(split[1]);
				var CurrentHour=currentDate.getHours();;

                              
				if(CurrentHour>23&&departurehour<12){
                                    departurehour=departurehour+24;
                                }

				deltaInMin=(departurehour-CurrentHour)*60+departureminute-currentDate.getMinutes();

                                console.log(deltaInMin);
                                console.log(CurrentHour);

                                if(deltaInMin>0&&deltaInMin<30&&deltaInMin*66.7*1.2>dist){
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
