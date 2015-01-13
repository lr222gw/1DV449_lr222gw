/**
 * Created by Lowe on 2015-01-10.
 */
"use strict";
var objects = {
    map : "",
    mapOption: "",
    userPosition: null,
    markers : [],
    lastUsedMarker : null,
    lastOpenWindow : null
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
    //
    //return [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}];
    return [
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 65
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 51
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "saturation": -100
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 30
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "saturation": -100
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": -25
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#00BCA5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#B81E58"
                }
            ]
        },
        {
            "featureType": "poi.government",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#F9E74A"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#F9E74A"
                },
                {
                    "saturation": -50
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        }
    ] ;
}