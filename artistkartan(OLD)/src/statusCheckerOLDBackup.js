
//Obs vissa saker finns i maps.js, maps.js kör vissa funktioner på statusChecker.js! :D
//Onload functionen finns där :3



if(localStorage["CachadeKonserter"] == undefined){
    localStorage["CachadeKonserter"] = [];
}

var hideOrShow = document.createElement("div");
hideOrShow.setAttribute("id", "hideOrShow");
hideOrShow.setAttribute("status", "show");
hideOrShow.innerHTML = "DÖLJ";
document.getElementById("logga").appendChild(hideOrShow);

window.onresize = function(){
    var topBanner = document.getElementById("topBanner");
    var mapcanvas = document.getElementById("mapcanvas");

    if(hideOrShow.innerHTML == "DÖLJ"){
        hideOrShow.innerHTML = "DÖLJ";
        topBanner.style.transition = "bottom 1s ease-in-out 0s";
        mapcanvas.style.transition = "bottom 1s ease-in-out 0s";
        if(document.getElementById("loadOverlay") != null){
            document.getElementById("loadOverlay").style.transition = "margin-top 1s ease-in-out 0s";
            document.getElementById("loadOverlay").style.marginTop = "-5px";
        }
        topBanner.style.bottom = "0" + "px";
        mapcanvas.style.bottom = "0" + "px";
    }else{
        hideOrShow.innerHTML = "DÖLJ";
        topBanner.style.transition = "bottom 1s ease-in-out 0s";
        mapcanvas.style.transition = "bottom 1s ease-in-out 0s";
        if(document.getElementById("loadOverlay") != null){
            document.getElementById("loadOverlay").style.transition = "margin-top 1s ease-in-out 0s";
            document.getElementById("loadOverlay").style.marginTop = "-5px";
        }
        topBanner.style.bottom = "0" + "px";
        mapcanvas.style.bottom = "0" + "px";
    }

}



hideOrShow.onclick = function(e){

    if(e.target.innerHTML == "DÖLJ"){
        e.target.innerHTML = "VISA";
        topBanner.style.transition = "bottom 1s ease-in-out 0s";
        mapcanvas.style.transition = "bottom 1s ease-in-out 0s";
        if(document.getElementById("loadOverlay") != null){
            document.getElementById("loadOverlay").style.transition = "margin-top 1s ease-in-out 0s";
            document.getElementById("loadOverlay").style.marginTop = "-"+ (topBanner.clientHeight + 5) + "px";
        }
        topBanner.style.bottom = topBanner.clientHeight + "px";
        mapcanvas.style.bottom = topBanner.clientHeight + "px";


    }else{
        e.target.innerHTML = "DÖLJ";
        topBanner.style.transition = "bottom 1s ease-in-out 0s";
        mapcanvas.style.transition = "bottom 1s ease-in-out 0s";
        if(document.getElementById("loadOverlay") != null){
            document.getElementById("loadOverlay").style.transition = "margin-top 1s ease-in-out 0s";
            document.getElementById("loadOverlay").style.marginTop = "-5px";
        }
        topBanner.style.bottom = "0%";
        mapcanvas.style.bottom = "0%";


    }



}



$.ajax({
    type: "get",
    url: "getstuff.php",
    async: true,
    data: {function: "isUserOnline"},
    success: function(data){

        if(data != false){
            var login = document.getElementById("loginspotify");

            login.style.display = "none";

            var body = document.getElementById("body");

            var logout = document.createElement("form");
            logout.setAttribute("method", "GET");
            logout.setAttribute("action", "logout.php");
            var logoutButton = document.createElement("input");
            logoutButton.setAttribute("value", "Logga ut, " + data);
            logoutButton.setAttribute("type", "submit");
            logoutButton.setAttribute("id", "logout");
            logout.appendChild(logoutButton);
            document.getElementById("logga").insertBefore(logout, document.getElementById("loginspotify"));
            localStorage["UserID"] = data;

        }
    }
});

// Icke användbart, ny lösning ska implementeras... Denna är för krävande
/*getConcertsFromYourCountry = function(lat, lng){

    if(objects.userPosition != null){

        if(lat != null && lng != null){
            lat = lat;
            lng = lng;
        }else{
            lat = objects.userPosition.k;
            lng = objects.userPosition.D;
        }

        $.ajax({
            type: "get",
            url: "getstuff.php",
            async: true,
            data: {function: "getLocationForConcertsOverCountry", longtidue: lng ,latitude: lat},
            success: function(data){
                console.log(data);
                placeConcertsOnMap(JSON.parse(data));
            }
        });
    }else{
        alert("För att hitta artister nära dig så måste du godkänna GeoLocation...");
    }

}*/

prepareLoadingScreen = function(){
    if(document.getElementById("loadOverlay") == null){
        var overlay = document.createElement("div");
        overlay.id = "loadOverlay";
        var overlayimg = document.createElement("div");
        overlayimg.id = "overlayImg";
        var img = document.createElement("img");
        img.src = "pic/LoadingNormalSpeed.gif";
        img.id = "loadImg";
        overlayimg.appendChild(img);
        overlay.appendChild(overlayimg);
        document.body.insertBefore(overlay, document.getElementById("mapcanvas"));
        if(document.getElementById("hideOrShow").innerHTML === "VISA"){
            document.getElementById("loadOverlay").style.marginTop = "-"+ (document.getElementById("topBanner").clientHeight + 5) + "px";
        }
    }else{
        if(document.getElementById("loadOverlay").style.display == "none"){

            document.getElementById("loadOverlay").style.display = "block";
        }else{
            document.getElementById("loadOverlay").style.display = "none";
        }
    }

}

setLastCheckedLocationName = function(){
    $.ajax({
        type: "get",
        url: "getstuff.php",
        async: true,
        data: {function: "getLastCheckedLocationName"},
        success: function(data){

            if(document.getElementById("LastChecked") == null){
                var LastChecked = document.createElement("div");
                LastChecked.setAttribute("id", "LastChecked");
                LastChecked.innerHTML = data;
                document.getElementById("logga").appendChild(LastChecked);
            }else{
                document.getElementById("LastChecked").innerHTML = data;



                document.getElementById("LastChecked").style.transition = "padding-top 0.4s ease-in 0s";
                document.getElementById("LastChecked").style.paddingTop = "45" + "px";
                /*setTimeout(function(){
                    document.getElementById("LastChecked").style.transition = "padding-top 0.1s ease-in-out 0s";
                    document.getElementById("LastChecked").style.paddingTop = "55" + "px";
                },400);*/
                setTimeout(function(){
                    document.getElementById("LastChecked").style.transition = "padding-top 0.4s ease-out 0s";
                    document.getElementById("LastChecked").style.paddingTop = "25" + "px";
                },400);




            }


        }
    });
}

getConcertsNearYourLocation = function(lat, lng){
//namenet är lite missvisande, det den gör är att den hämtar Konserter för en viss location,
//Om inget annat anges hämtas location från geolocation...
    prepareLoadingScreen();
    if(lat != null && lng != null){
        lat = lat;
        lng = lng;
    }else{
        lat = objects.userPosition.k;
        lng = objects.userPosition.D;
    }

    $.ajax({
        type: "get",
        url: "getstuff.php",
        async: true,
        data: {function: "getLocationForConcerts", longtidue: lng ,latitude: lat, metroArr: JSON.stringify(objects.LocationMapMetroIDOnMap)},
        success: function(data){
            setLastCheckedLocationName();
            if( data == "nope"){
                console.log("Cant update until later! :< ");
            }else{
                if(data != "" && data != "[null]"){
                    //console.log(data);
                    if(JSON.parse(data).length !=  1){
                        // Om JSON.parse(data) blir 1 så innerbär det att den bara innehåller MetroID,
                        // Då vill vi inte skriva ut något, utan bara berätta att det ej finns några konserter här.
                    placeConcertsOnMap(JSON.parse(data));

                    }else{
                        var pos = new google.maps.LatLng(
                            lat,
                            lng);

                        var infowindow = new InfoBubble({
                            map: objects.map,
                            position: pos,
                            content: 'Tyvärr, inga uppkommande event här :('
                        });
                        infowindow.open();

                    }
                    console.log("Location Populated! :D ");
                }
            }
            objects.map.setOptions({draggableCursor: 'url(pic/openhand.ico), move'});
            prepareLoadingScreen();

        }
    });




}




FastPlaceConcertWithArrayOfLocationsWithConcerts = function(ArrayOfLocationsWithConcerts){
    //Larvigt namn, jag vet... denna funkion är bara en liten utbrytning...
    for(var i = 0; i < ArrayOfLocationsWithConcerts.length; i++){
        var ConcertArrayData = JSON.parse(ArrayOfLocationsWithConcerts[i].LocationJson);
        placeConcertsOnMap(ConcertArrayData);
    }
}


/*placeConcertsOnMap = function(ConcertData){

    if(objects.LocationMapMetroIDOnMap.indexOf(ConcertData.MetroID + ConcertData.id) == -1){ // ConcertData[ConcertData.length] == MetroID
        //Om det är första gången denna locations Events hämtats så ska den läggas in, nästa gång så ska den ej skrivas ut..
        objects.LocationMapMetroIDOnMap.push(ConcertData.MetroID + ConcertData.id);

        ConcertData.sameLatNLngID = ConcertData.location.lat.toString() + ConcertData.location.lng.toString();

        if(objects.sameLatNLngIDArr.indexOf(ConcertData.sameLatNLngID) == -1){
            objects.sameLatNLngIDArr.push(ConcertData.sameLatNLngID);
            Single_MakeMarkerAndInfoWindowOfConcertData(ConcertData);
        }else{
            var posistions = [ConcertData.location.lat, ConcertData.location.lng, ConcertData.sameLatNLngID];
            MakeMultiMarker(posistions);
            moveSingleMarkerToMultiMarkerIfNeeded();
        }

    }else{

    }

}*/

/*
function moveSingleMarkerToMultiMarkerIfNeeded(){
    for(var i = 0; i < objects.markers.length; i++){ // -1 här. varför ska den behöva vara där ? :< :(


        for(var j= 0; j < objects.MultiMarkers.length; j++){

            if(objects.markers[i].sameLatNLngID == objects.MultiMarkers[j].sameLatNLngID){
                //Om detta är true så ska SingelMarken försvinna från kartan och flyttas in i MultiMarkern
                Multi_MakeMarkerAndInfoWindowOfConcertData(objects.markers[i].concertData);
                objects.markers[i].map = "";
                objects.markers.splice(i, 1);
                break;
            }

        }
    }
}
*/

function Single_MakeMarkerAndInfoWindowOfConcertData(ConcertData){ //tar hand om Konsärer som inte har unika positioner

    var InfoWindowContent = createInfoWindowWithConcertData(ConcertData);

    var infoWindowForMarker = new InfoBubble({
        content: InfoWindowContent,
        maxWidth: 500
    });

    var image = new google.maps.MarkerImage( //Konstig formel för att göra Markern större...
        "pic/marker.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(42, 48)
    );
    //var image = 'pic/marker.png';
    var myLatLng = new google.maps.LatLng(ConcertData.location.lat, ConcertData.location.lng);
    var ConcertMarker = new google.maps.Marker({
        position: myLatLng,
        map: objects.map,
        icon: image,
        infoWindow : infoWindowForMarker,
        sameLatNLngID : ConcertData.sameLatNLngID,
        concertData : ConcertData
    });
    objects.markers.push(ConcertMarker);


    google.maps.event.addListener(ConcertMarker, 'click', function(){

        if(objects.lastOpenWindow != null){
            objects.lastOpenWindow.close();
        }

        ConcertMarker.infoWindow.open(objects.map, ConcertMarker);

        objects.lastUsedMarker = ConcertMarker;
        objects.lastOpenWindow = ConcertMarker.infoWindow;

    });
}

function Multi_MakeMarkerAndInfoWindowOfConcertData(ConcertData){

    //hitta Rätt MultiMarker att anvädna...
    var markerToUse;
    for(var i = 0; i < objects.MultiMarkers.length; i++){
        /*if(ConcertData.location.lat == objects.MultiMarkers[i].position.k && ConcertData.location.lng == objects.MultiMarkers[i].position.D){
            markerToUse = objects.MultiMarkers[i];
            break;
        }*/
        if(ConcertData.sameLatNLngID == objects.MultiMarkers[i].sameLatNLngID){
            markerToUse = objects.MultiMarkers[i];
            break;
        }
    }
    var ContentForInfoWindow = createInfoWindowWithConcertData(ConcertData); //Hämta ut relevant visningsdata för denna konsär...

    var infoWindowForOtherInfoWindow = new InfoBubble({ // Lägg in den i ett InfoWindow
        content: ContentForInfoWindow,
        maxWidth: 500
    });

    var newWindowButton = document.createElement("input");
    newWindowButton.setAttribute("type", "submit");
    var id = ConcertData.id;
    newWindowButton.setAttribute("id", id);
    newWindowButton.style.display = "none";
    newWindowButton.setAttribute("value", ConcertData.displayName);
    newWindowButton.infoWindow = infoWindowForOtherInfoWindow;
    newWindowButton.marker = markerToUse;

    if(markerToUse != undefined){
        //Om markernToUse är undifned här nere, så har något gått snätt t
        markerToUse.infoWindow.setContent(markerToUse.infoWindow.content +
            '<a class="concertPlus" onclick="document.getElementById(\''+ id +'\').click();return false;" >'+ConcertData.displayName+'</a>');

        newWindowButton.onclick = function (e){

            if(objects.lastOpenWindow != null){
                objects.lastOpenWindow.close();
            }

            e.target.infoWindow.open(objects.map, e.target.marker);

            objects.lastUsedMarker = newWindowButton;
            objects.lastOpenWindow = newWindowButton.infoWindow;

        };

        document.body.appendChild(newWindowButton);
    }



}

function MakeMultiMarker(positions){

    var InfoWindowContent =
        '<div class="content">'+
            '<h1>Samtliga event händer här:</h1>'
        '</div>';

    var infoWindowForMarker = new InfoBubble({
        content: InfoWindowContent,
        maxWidth: 500
    });


    var image = new google.maps.MarkerImage(
        "pic/extraMarker.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(42, 48)
    );

    //var image = 'pic/extraMarker.png';
    var myLatLng = new google.maps.LatLng(positions[0], positions[1]);
    var ConcertMarker = new google.maps.Marker({
        position: myLatLng,
        map: objects.map,
        icon: image,
        infoWindow : infoWindowForMarker,
        sameLatNLngID : positions[2]
    });
    objects.MultiMarkers.push(ConcertMarker);

    google.maps.event.addListener(ConcertMarker, 'click', function(){

        if(objects.lastOpenWindow != null){
            objects.lastOpenWindow.close();
        }

        ConcertMarker.infoWindow.open(objects.map, ConcertMarker);

        objects.lastUsedMarker = ConcertMarker;
        objects.lastOpenWindow = ConcertMarker.infoWindow;

    });

}

function createInfoWindowWithConcertData(ConcertData){
    var displayName;
    var preformances = "";

    for(var j=0;j<ConcertData.performance.length;j++){//Tar fram en sträng med artister/band per konsert...
        preformances += "<a href='"+ConcertData.performance[j].artist.uri+"'>"+"<p>"+ConcertData.performance[j].displayName+"</p></a>";
    }


    if(ConcertData.displayName.indexOf(" (") == -1){
        displayName = ConcertData.displayName;
    }else{
        displayName = ConcertData.displayName.substr(0,ConcertData.displayName.indexOf(" ("));
    }

    var time = ConcertData.start.time;
    if(time == null){
        time = "";
    }

    var eventContent;
    if(preformances.length == 0){
        eventContent = "<h3>Inga bestämda uppträdanden</h3>";
    }else{
        eventContent = '<h3>Uppträdanden:</h3>'+ preformances;
    }

    var InfoWindowContent =
        '<div class="content">'+
            '<h1 id="firstHeading" class="firstHeading">'+displayName+'</h1>'+
            /*'<div id="bodyContent">'+*/
            '<h2>Tid och Datum: '+ConcertData.start.date + ' ' +time +'</h2>'+
            eventContent +
    '<h3><a href='+ConcertData.uri+'>Biljetter och mer info här!</a></h3>'
    /*'</div>'+*/
    '</div>';
    return InfoWindowContent;
}



/*var PopulatePlaylistButton = document.createElement("input");
PopulatePlaylistButton.setAttribute("value", "Logga ut, ");
PopulatePlaylistButton.setAttribute("type", "submit");*/
populateUserWithArtistData = function(){
    $.ajax({
        type: "get",
        url: "getstuff.php",
        async: true,
        data: {function: "getUsersArtists"},
        success: function(data){
            if( data == "nope"){
                console.log("Cant update until later! :< ");
            }else{
                console.log("Artist Populated! :D ");
                localStorage[localStorage["UserID"]]["artists"] = data;

            }

            //var div = document.createElement("div");
            //div.setAttribute("")

            //div.innerHTML = data;
            /*for(var i = 0; i < data.length; i++){
             div.innerHTML += data[i];
             }*/
            //document.body.insertBefore(div, document.body.firstChild);
        }
    });
}


//BACKUP2:
/*
 function Multi_MakeMarkerAndInfoWindowOfConcertData(ConcertData){

 //hitta Rätt MultiMarker att anvädna...
 var markerToUse;
 for(var i = 0; i < objects.MultiMarkers.length; i++){
 /*if(ConcertData.location.lat == objects.MultiMarkers[i].position.k && ConcertData.location.lng == objects.MultiMarkers[i].position.D){
 markerToUse = objects.MultiMarkers[i];
 break;
 }*/ /* <- obs ska bort sen.. liksom är bara så att allt ska bli en kommentar
if(ConcertData.sameLatNLngID == objects.MultiMarkers[i].sameLatNLngID){
    markerToUse = objects.MultiMarkers[i];
    break;
}
}
var ContentForInfoWindow = createInfoWindowWithConcertData(ConcertData); //Hämta ut relevant visningsdata för denna konsär...

var infoWindowForOtherInfoWindow = new InfoBubble({ // Lägg in den i ett InfoWindow
    content: ContentForInfoWindow,
    maxWidth: 500
});

var newWindowButton = document.createElement("input");
newWindowButton.setAttribute("type", "submit");
var id = ConcertData.id;
newWindowButton.setAttribute("id", id);
newWindowButton.style.display = "none";
newWindowButton.setAttribute("value", ConcertData.displayName);
newWindowButton.infoWindow = infoWindowForOtherInfoWindow;
newWindowButton.marker = markerToUse;

if(markerToUse != undefined){
    //Om markernToUse är undifned här nere, så har något gått snätt t
    markerToUse.infoWindow.setContent(markerToUse.infoWindow.content +
        '<a class="concertPlus" onclick="document.getElementById(\''+ id +'\').click();return false;" >'+ConcertData.displayName+'</a>');

    newWindowButton.onclick = function (e){

        if(objects.lastOpenWindow != null){
            objects.lastOpenWindow.close();
        }

        e.target.infoWindow.open(objects.map, e.target.marker);

        objects.lastUsedMarker = newWindowButton;
        objects.lastOpenWindow = newWindowButton.infoWindow;

    };

    document.body.appendChild(newWindowButton);
}



}
*/


//BACKUP:
/*
 placeConcertsOnMap = function(ConcertData){

 if(objects.LocationMapMetroIDOnMap.indexOf(ConcertData.MetroID + ConcertData.sameLatNLngID) == -1){ // ConcertData[ConcertData.length] == MetroID
 //Om det är första gången denna locations Events hämtats så ska den läggas in, nästa gång så ska den ej skrivas ut..
 objects.LocationMapMetroIDOnMap.push(ConcertData.MetroID + ConcertData.sameLatNLngID);
 //delete ConcertData.LocationMapMetroID;
 //Gammalt... ->//ConcertData.pop(ConcertData.length); //Tar bort sista i arrayen, alltså MetroID't...

 var positionsLat = [];
 var positionsLng = [];
 var positions = [];
 var ConcertThatHasSameLatNLng = [];
 var ConcertThatDoesNotHaveSameLatNLng = [];
 var sameLatNLngID;// = 840; // används för att identifera Konsärer som har samma Lng och Lat... (används i funktionen MultiMakeMarkerAndInfoWindowOfConcertData)...
 for(var i = 0; i < ConcertData.length;i++){ //Ska hitta om det finns Konsärer på Samma Position.. Om det finns = ska lösas..

 var Counter = 0;
 for(var j=0; j < ConcertData.length; j++){

 if(ConcertData[i].location.lat == ConcertData[j].location.lat && ConcertData[i].location.lng == ConcertData[j].location.lng){
 Counter++;// Räknar hur många gånger konserter med samma lat och lng finns i Arrayen
 }

 }
 if(Counter >= 2){
 //Finns det 2 eller mer så läggs de in i en egen array

 if(positionsLat.indexOf(ConcertData[i].location.lat) == -1 && positionsLng.indexOf(ConcertData[i].location.lng) == -1){
 sameLatNLngID = (ConcertData[i].location.lat.toString() + ConcertData[i].location.lng.toString());
 positionsLat.push(ConcertData[i].location.lat);
 positionsLng.push(ConcertData[i].location.lng);
 positions.push([ConcertData[i].location.lat, ConcertData[i].location.lng, sameLatNLngID]);
 }
 ConcertData[i].sameLatNLngID = (ConcertData[i].location.lat.toString() + ConcertData[i].location.lng.toString());
 ConcertThatHasSameLatNLng.push(ConcertData[i]);

 }else{
 //Finns det bara 1 så läggs dom i en egen array...
 ConcertThatDoesNotHaveSameLatNLng.push(ConcertData[i]);
 }

 }

 for(var i = 0; i < ConcertThatDoesNotHaveSameLatNLng.length;i++){
 //Notera att om jag hade kört koden i denna loop så hade saker skitit sig:
 //om man tryckt på en marker så skulle bara Data från den sista markern att skrivas ut, på dens possition..
 //genoom att jag låter en annan funktion ta  hand om det så försvinner problemet.. hur?
 Single_MakeMarkerAndInfoWindowOfConcertData(ConcertThatDoesNotHaveSameLatNLng[i]);
 }

 for(var i = 0; i < positions.length; i++){
 MakeMultiMarker(positions[i]);
 }

 for(var i = 0; i < ConcertThatHasSameLatNLng.length;i++){
 Multi_MakeMarkerAndInfoWindowOfConcertData(ConcertThatHasSameLatNLng[i]);
 }
 }

 }

*/





/*

var preformances = "";

for(var j=0;j<ConcertData[i].performance.length;j++){//Tar fram en sträng med artister/band per konsert...
    preformances += "<a href='"+ConcertData[i].performance[j].artist.uri+"'>"+"<p>"+ConcertData[i].performance[j].displayName+"</p></a>";
}

var InfoWindowContent =
    '<div id="content">'+
        '<h1 id="firstHeading" class="firstHeading">'+ConcertData[i].displayName+'</h1>'+
        '<div id="bodyContent">'+
        '<h3>Uppträdanden</h3>'+
        preformances
'<a href='+ConcertData[i].uri+'>Biljetter och mer info här!</a>'
'</div>'+
'</div>';

var infoWindowForMarker = new google.maps.InfoWindow({
    content: InfoWindowContent
});

var image = 'pic/marker.png';
var myLatLng = new google.maps.LatLng(ConcertData[i].location.lat, ConcertData[i].location.lng);
var ConcertMarker = new google.maps.Marker({
    position: myLatLng,
    map: objects.map,
    icon: image,
    infoWindow : infoWindowForMarker
});
objects.markers.push(ConcertMarker);


google.maps.event.addListener(ConcertMarker, 'click', function(){
    ConcertMarker.infoWindow.open(objects.map, ConcertMarker);
});*/

//backup:

/*

 getLocationFromCache = function(){
 $.ajax({
 type: "get",
 url: "getstuff.php",
 async: true,
 data: {function: "getLocationsFromCache"},
 success: function(data){
 //localStorage["CachadeKonserter"] = data;
 prepareLoadingScreen();
 var ArrayOfLocationsWithConcerts = JSON.parse(data);

 for(var i=0; i< ArrayOfLocationsWithConcerts.length;i++){
 getLocationEventsIDsFromCache(ArrayOfLocationsWithConcerts[0].MetroID);
 }


 //FastPlaceConcertWithArrayOfLocationsWithConcerts(ArrayOfLocationsWithConcerts);
 }
 });
 }
 getLocationEventsIDsFromCache = function($metroID){
 $.ajax({
 type: "get",
 url: "getstuff.php",
 async: true,
 data: {function: "getLocationEventsIDsFromCache", id : $metroID},
 success: function(data){
 var locationEventsIDs = JSON.parse(data);
 for(var i = 0; i< locationEventsIDs.length; i++){
 getConcertsFromCache(locationEventsIDs[i].LocationEventsID, $metroID);
 }
 }
 });
 }

 getConcertsFromCache = function($locationEventID, $metroID){
 var $metroID = $metroID;
 $.ajax({
 type: "get",
 url: "getstuff.php",
 async: true,
 data: {function: "getConcertsFromCache", id : $locationEventID},
 success: function(data){
 var LocationsConcertsJSON = JSON.parse(data);
 var LocationConcerts = JSON.parse(LocationsConcertsJSON[0].LocationEventJSON);

 for(var i = 0; i < LocationConcerts.length; i++){
 var ConcertData = (LocationConcerts[i]);
 ConcertData.MetroID = $metroID;
 placeConcertsOnMap(ConcertData);
 }

 }
 });
 }

*/