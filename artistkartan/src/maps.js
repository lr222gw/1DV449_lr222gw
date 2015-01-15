/**
 * Created by Lowe on 2015-01-10.
 */
"use strict";
var objects = {
    map : "",
    mapOption: "",
    userPosition: null,
    markers : [],
    MultiMarkers : [],
    lastUsedMarker : null,
    lastOpenWindow : null,
    LocationMapMetroIDOnMap : []
}



function init(){

    objects.mapOptions = {
        center: { lat: 61.481394783060125, lng: 17.419128417968746}, //Sweden som standard...
        zoom: 12,
        styles: getMapStyle()
    };

    objects.map = new google.maps.Map(document.getElementById("mapcanvas"), objects.mapOptions);


    if(navigator.geolocation){ // om användaren tillåter GeoLocation så går kartan direkt dit användaren befinner sig...

        navigator.geolocation.getCurrentPosition(function(position) { //kod från google...
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var infowindow = new google.maps.InfoWindow({
                map: objects.map,
                position: pos,
                content: 'Du är här'
            });
            objects.userPosition = pos; // sätter så att jag har användarens position...
            objects.map.setCenter(pos);

            //Om användaren tillåter geoLocation vill vi genast fylla på data där den befinner sig
            getConcertsNearYourLocation();

        }, function() {
            handleNoGeolocation(true);
        });

    }

    google.maps.event.addDomListener(window,  'load', init);

    google.maps.event.addListener(objects.map, "rightclick", function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        // populate yor box/field with lat, lng
        objects.map.setOptions({draggableCursor: 'wait'});
        getConcertsNearYourLocation(lat,lng);
    });




}

window.onload = function(){
    init();
    // Körs när man laddar sidan; vill hämta datan! :D

    getConcertsFromCache();
}

function getMapStyle(){
    //https://snazzymaps.com/style/30/cobalt
    //
    return [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}];

}