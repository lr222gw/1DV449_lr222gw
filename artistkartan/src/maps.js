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
    timer : null,
    geoLocationIsOn : false,
    myPositionMarker : null,
    myPositionCicle : null

}
var mouse = {x: 0, y: 0}; //HÄR





function init(){

    objects.mapOptions = {
        center: { lat: 17.714230406408745, lng: -23.53286520000005 }, //Hela världen (typ) som standard...
        zoom: 3,
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
            localStorage["userPosition"] = pos;
            objects.userPosition = pos; // sätter så att jag har användarens position...
            objects.map.setCenter(pos);
            objects.map.setZoom(12);
            objects.geoLocationIsOn = true;

            //Om användaren tillåter geoLocation vill vi genast fylla på data där den befinner sig
            getConcertsFromCache();
            getConcertsNearYourLocation();

        }, function() {
            if(objects.geoLocationIsOn){
                handleNoGeolocation(true);
            }
        });

    }

    google.maps.event.addDomListener(window,  'load', init);

    google.maps.event.addListener(objects.map, "rightclick", function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        // populate yor box/field with lat, lng
        //objects.map.setOptions({draggableCursor: 'wait'});

        getConcertsNearYourLocation(lat,lng);
    });

    //För mobil, för att lägga till .. Håll in i 1,5 sekunder för att släppa markör.. drar du i 1,5 sekunder så
    //kommer markör släppas där du släpper..
    //↓DENNA LÖSNING  FUNGERAR (Härifrån ner till slutet av funktionen)↓

    //Koden nedan ska bara köras om det är touch, (de två raderna under hjälper till o kolla om de e touch)
    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    var generalTouchEnabled = "ontouchstart" in document.createElement("div");

    //Kod för att markera tryckningar...
    var myDiv = document.createElement("div");
    myDiv.style.backgroundColor = "rgb(83, 173, 218)";
    myDiv.style.borderRadius = "125px";
    myDiv.style.height = "0px";
    myDiv.style.width = "0px";
    myDiv.id = "myDiv";
    myDiv.style.position = "fixed";
    myDiv.style.zIndex = "90";
    document.body.appendChild(myDiv);

    //Kod som känner av att man håller nere och drar musen,
    //Ändrar y och x på div...
    var isMouseDown = false;
    document.onmousedown = function() { isMouseDown = true };
    document.onmouseup   = function() { isMouseDown = false };
    document.onmousemove = function() { if(isMouseDown) {
        myDiv.style.transition = "background-color 0.5s  0s, height 1.5s  0s, width 1.5s  0s, left 0s  0s, top 0s  0s ";
        document.getElementById("myDiv").style.left = mouse.x - parseInt(document.getElementById("myDiv").clientWidth)/2+"px"; //- parseInt(document.getElementById("myDiv").style.width)/2
        document.getElementById("myDiv").style.top = mouse.y - parseInt(document.getElementById("myDiv").clientHeight)/2+"px"; //- parseInt(document.getElementById("myDiv").style.height)/2
    } };



    function LongClick( map, length) {
        this.length_ = length;
        var me = this;
        me.map_ = map;
        google.maps.event.addListener(map, 'mousedown', function(e) { me.onMouseDown_(e) });
        google.maps.event.addListener(map, 'mouseup', function(e) { me.onMouseUp_(e) });
        //google.maps.event.addListener(map, 'mousemove', function(e) { me.onMouseMove_(e) });
    }



    if(msTouchEnabled || generalTouchEnabled){
        //Detta listener känner av var musen är och
        //Tilldelar positionen till mouse, mouse.x och mouse.y
        //Där kan de hämtas sen
        document.addEventListener('mousemove', function(e){
            mouse.x = e.clientX || e.pageX;
            mouse.y = e.clientY || e.pageY;
        }, false);


        LongClick.prototype.onMouseUp_ = function(e) {
            //Så fort musen släpps så ska den försvinna..

            /*myDiv.style.transition = "height 1.5s  0s";
            myDiv.style.height = "0" + "px";*/
            /*myDiv.style.transition = "height 1.5s  0s, width 1.5s  0s";
            myDiv.style.height = "0" + "px";
            myDiv.style.width = "0" + "px";*/


            var now = +new Date;
            if (now - this.down_ > this.length_) {
                //Om rätt antal tid gått och vi kommit in här
                //så ska det markeras att användarens tryckning hämtat data.
                myDiv.style.transition = "background-color 0.5s  0s, height 0.5s  0s, width 0.5s  0s, opacity 1.5s 0s";
                myDiv.style.backgroundColor = "rgb(0, 255, 12)";

                //Timern berättar hur länge den ska stanna på att vara grön. en halv sekund
                setTimeout(function(){
                    myDiv.style.transition = "height 0.0s  0s, width 0.0s  0s, opacity 1.5s 0s";
                    myDiv.style.left = (mouse.x -parseInt(document.getElementById("myDiv").clientWidth)/2) + "px";
                    myDiv.style.top = (mouse.y -parseInt(document.getElementById("myDiv").clientHeight)/2) + "px";
                    myDiv.style.height = "0"+ "px";
                    myDiv.style.width = "0" + "px";
                    myDiv.style.opacity = "0";
                },500)



                google.maps.event.trigger(this.map_, 'longpress', e);
            }else{
                setTimeout(function(){
                    myDiv.style.transition = "height 0.0s  0s, width 0.0s  0s";
                    myDiv.style.height = "0" + "px";
                    myDiv.style.width = "0" + "px";
                    myDiv.style.backgroundColor = "rgb(83, 173, 218)";
                },600 + (myDiv.timer - new Date().getTime()))
            }


        }
        LongClick.prototype.onMouseDown_ = function() {

            //Två raderna under är inkluderade då vi vill se till att när man först trycker
            //Så ska positionen hittas.. annars dyker den upp på föregående ställe man tryckte
            //tills man utför mouse move...
            myDiv.style.backgroundColor = "rgb(83, 173, 218)";
            document.getElementById("myDiv").style.left = (mouse.x -parseInt(document.getElementById("myDiv").style.width)/2)+"px";
            document.getElementById("myDiv").style.top = (mouse.y -parseInt(document.getElementById("myDiv").style.height)/2)+"px";


            //Här berättar vi att storleken ska öka, vi gör det i en timeout
            //För att ge myDiv lite tid att flytta sig (som vi gör två raderna över)...
            setTimeout(function(){
                /*myDiv.style.transition = "height 1.5s  0s";*/

                myDiv.style.transition = "background-color 0.5s  0s, height 1.5s  0s, width 1.5s  0s, left 1.5s  0s, top 1.5s  0s, opacity 0s 0s ";
                myDiv.style.height = "125" + "px";
                myDiv.style.width = "125" + "px";
                myDiv.style.opacity = "1" ;
                myDiv.style.left = (mouse.x -parseInt(document.getElementById("myDiv").style.width)/2) + "px";
                myDiv.style.top = (mouse.y -parseInt(document.getElementById("myDiv").style.height)/2) + "px";

            },500)

            //Denna timeout presenterar när användaren har hållt nere fingret tilllräckligt
            //För att data ska hämtas.
            setTimeout(function(){
                myDiv.style.backgroundColor = "rgb(72, 77, 195)";
            },1500);

            myDiv.timer = new Date().getTime();

            this.down_ = +new Date;
        }

        new LongClick(objects.map, 2000);
        google.maps.event.addListener(objects.map, 'longpress', function(event) {

            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            //getConcertsFromCache();
            getConcertsNearYourLocation(lat,lng);

        });
    }

}

window.onload = function(){
    init();
    checkApiStatus();
    // Körs när man laddar sidan; vill hämta datan! :D
    prepareLoadingScreen();

    //↓Är flyttat till geolocation funktionen, då den bara anropas om geolocation är igång..
    //getConcertsFromCache();
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
