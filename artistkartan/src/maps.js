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
    LocationMapMetroIDOnMap : [],
    timer : null

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

            var infowindow = new InfoBubble({
                map: objects.map,
                position: pos,
                content: 'Du är här'
            });
            infowindow.open();
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

    //För mobil, för att lägga till .. Håll in i 1,5 sekunder för att släppa markör.. drar du i 1,5 sekunder så
    //kommer markör släppas där du släpper..

    function LongClick( map, length) {
        this.length_ = length;
        var me = this;
        me.map_ = map;
        google.maps.event.addListener(map, 'mousedown', function(e) { me.onMouseDown_(e) });
        google.maps.event.addListener(map, 'mouseup', function(e) { me.onMouseUp_(e) });
    }
    LongClick.prototype.onMouseUp_ = function(e) {
        var now = +new Date;
        if (now - this.down_ > this.length_) {
            google.maps.event.trigger(this.map_, 'longpress', e);
        }
    }
    LongClick.prototype.onMouseDown_ = function() {
        this.down_ = +new Date;
    }
    new LongClick(objects.map, 1500);
    google.maps.event.addListener(objects.map, 'longpress', function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
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

//OLD:
/*
document.addEventListener('touchmove', function(e){

    //stops short touches from firing the event
    console.log(e.changedTouches[0]);


});
var onlongtouch;
var touchduration = 500; //length of time we want the user to touch before we do something
onlongtouch = function(){
    getConcertsNearYourLocation(lat,lng);
}
google.maps.event.addListener(objects.map, "touchstart", function(event) {

    objects.timer = setTimeout(onlongtouch, touchduration);

    var lat = event.latLng.lat();
    var lng = event.latLng.lng();

    if (objects.timer){
        clearTimeout(objects.timer);
    }


});
google.maps.event.addListener(objects.map, "touchend", function(event) {

    if (objects.timer){
        clearTimeout(objects.timer);
    }


});*/


//OLD:
/*
function LongClick( map, length) {
    this.length_ = length;
    var me = this;
    me.map_ = map;
    google.maps.event.addListener(map, 'mousedown', function(e) { me.onMouseDown_(e) });
    google.maps.event.addListener(map, 'mouseup', function(e) { me.onMouseUp_(e) });
}
LongClick.prototype.onMouseUp_ = function(e) {
    var now = +new Date;
    if (now - this.down_ > this.length_) {
        google.maps.event.trigger(this.map_, 'longpress', e);
    }
}
LongClick.prototype.onMouseDown_ = function() {
    this.down_ = +new Date;
}
new LongClick(objects.map, 1500);
google.maps.event.addListener(objects.map, 'longpress', function(event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    getConcertsNearYourLocation(lat,lng);
});*/
