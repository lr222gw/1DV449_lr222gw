/**
 * Created by Lowe on 2015-01-10.
 */
"use strict";
var objects = {
    map : "",
    mapOption: "",
    userPosition: null
}


function init(){

    objects.mapOptions = {
        center: { lat: 61.481394783060125, lng: 17.419128417968746}, //Sweden som standard...
        zoom: 5,
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
        }, function() {
            handleNoGeolocation(true);
        });

    }

    google.maps.event.addDomListener(window,  'load', init);

}

window.onload = function(){
    init();
}

function getMapStyle(){
    //https://snazzymaps.com/style/30/cobalt
    return [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}];
}