#curl -v -X POST -H 'application/xml' -d '<?xml version="1.0" encoding="UTF-8"?><Trias version="1.0" xmlns ="trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
#    <ServiceRequest><siri:RequestTimestamp>2016-10-29T01:36:00</siri:RequestTimestamp>\
#    <siri:RequestorRef>SEUS</siri:RequestorRef>\
#    <RequestPayload>\
#        <TripRequest>\
#            <Origin>\
#                <LocationRef>\
#                    <GeoPosition>\
#                        <Longitude>13.73218</Longitude>\
#                        <Latitude>51.04020</Latitude>\
#                    </GeoPosition>\
#                    <LocationName>\
#                        <Text></Text>\
#                    </LocationName>\
#                </LocationRef>\
#                <DepArrTime>2016-10-29T01:25:00</DepArrTime>\
#            </Origin>\
#            <Destination>\
#                <LocationRef>\
#                    <GeoPosition>\
#                        <Longitude>13.751272</Longitude>\
#                        <Latitude>51.073372</Latitude>\
#                    </GeoPosition>\
#                    <LocationName>\
#                        <Text></Text>\
#                    </LocationName>\
#                </LocationRef>\
#            </Destination>\
#            <Params>\
#                <PtModeFilter></PtModeFilter>\
#            </Params>\
#        </TripRequest>\
#    </RequestPayload>\
#    </ServiceRequest>\
#    </Trias>' http://trias.vvo-online.de:9000/Middleware/Data/Trias



curl -v -X POST -H 'application/xml' -d '<?xml version="1.0" encoding="UTF-8"?> <Trias version="1.0" xmlns="trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <ServiceRequest> <siri:RequestTimestamp>2016-10-29T01:53:00</siri:RequestTimestamp> <siri:RequestorRef>SEUS</siri:RequestorRef> <RequestPayload> <TripRequest> <Origin> <LocationRef><GeoPosition> <Longitude>13.751272</Longitude> <Latitude>51.073372</Latitude> </GeoPosition><LocationName> <Text></Text> </LocationName> </LocationRef> <DepArrTime>2016-10-29T16:39:00</DepArrTime> </Origin> <Destination> <LocationRef><GeoPosition> <Longitude>13.733651</Longitude> <Latitude>51.039059</Latitude> </GeoPosition><LocationName> <Text></Text> </LocationName> </LocationRef> </Destination> <Params> <PtModeFilter></PtModeFilter> </Params> </TripRequest> </RequestPayload> </ServiceRequest> </Trias>'  http://trias.vvo-online.de:9000/Middleware/Data/Trias
