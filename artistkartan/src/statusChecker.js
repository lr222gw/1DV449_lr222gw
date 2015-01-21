
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

var ShowTodaysConcertButton = document.createElement("button");
ShowTodaysConcertButton.setAttribute("id", "showConcertsPlayingToday");
ShowTodaysConcertButton.innerHTML = "Visa konserter som spelar idag";
ShowTodaysConcertButton.onclick = function(){
    stopAllAnimations();
    setTimeout(function(){
        showAllTodaysConcerts();
    },200)
}
document.getElementById("logga").appendChild(ShowTodaysConcertButton);

var ShowFestivalsButton = document.createElement("button");
ShowFestivalsButton.setAttribute("id", "ShowFestivals");
ShowFestivalsButton.innerHTML = "Visa Festivalevent på kartan";
ShowFestivalsButton.onclick = function(){
    stopAllAnimations();
    setTimeout(function(){
        showAllFestivals();
    },200)

}
document.getElementById("logga").appendChild(ShowFestivalsButton);


var AboutButton = document.createElement("button");
AboutButton.id = "aboutSite";
AboutButton.innerHTML = "<p>Om Sidan</p>";

AboutButton.onclick = function(){
    var AboutDiv = document.createElement("div");
    AboutDiv.id = "aboutSiteDiv";
    AboutDiv.innerHTML = "" +
        "<div id='AboutContentBox'><h1>Om Sidan</h1>" +
        "<p>Konsertkartan.com är en gratis tjänst byggd med GoogleMaps Api och Songkicks Api.</p>" +
        "<p>Konsertkartan.com är till för att hjälpa dig att hitta ett musikevent (konsert, festival, etc) i närheten av dig,</p>" +
        "<p>eller på ett ställe där du är nyfiken att kika efter event på. Kanske ska du åka utomlands och snabbt vill se exakt vart</p>" +
        "<p>du kan hitta festivaler och konserter i närheten av ditt hotell.</p>" +
        "<p>Vad ska jag mer skriva här? Hoppas du har kul med sidan! :)</p>" +
        "<p class='thanksTo'>Tack till, för följande resurser:</p>" +
        "<p class='thanksTo'>Songkick.com, För datan om konserter och event som dom står för.</p>" +
        "<p class='thanksTo'>Nicolas Mollet, För ikonen till kartmarkören.</p>" +
        "<p class='thanksTo'>Google Maps, För kartan och dess funktioner.</p>" +
        "<p class='thanksTo'>Spotify, För att ta fram intressanta artister till användare.</p>" +
        "<p class='contactMe'>Vill du kontakta mig av någon anledning är min Email här: <address><a href='mailto:lowe.raivio@gmail.com'>lowe.raivio@gmail.com</a></address></p>" +
        "</div>";

    var CloseButton = document.createElement("button");
    CloseButton.id = "closeAboutScreen";
    CloseButton.innerHTML = "Stäng mig";
    CloseButton.onclick = function(){
        document.getElementById("aboutSiteDiv").parentNode.removeChild(document.getElementById("aboutSiteDiv"));
    }
    AboutDiv.appendChild(CloseButton);


    document.body.insertBefore(AboutDiv, document.body.firstChild);
}

document.body.appendChild(AboutButton);


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

            var showMeArtists = document.createElement("a");
            showMeArtists.setAttribute("id", "relevantArtists");
            showMeArtists.setAttribute("href", "#")
            showMeArtists.onclick = function(){
                populateUserWithArtistData();
                spotifyFunctionSomething();
                objects.map.setZoom(5);
            }
            var pTagg = document.createElement("p");
            pTagg.innerHTML = "Visa relevanta artister";
            showMeArtists.appendChild(pTagg);

            var toolTipSpan = document.createElement("span");
            toolTipSpan.innerHTML = "<p>Visar konserter av dina intressen.</p> <p>(av dom som syns på kartan)</p><p>Hämta konserter genom att <b>högerklicka</b> på plats av intresse.</p> <p>:)</p>";
            showMeArtists.appendChild(toolTipSpan);
            document.getElementById("logga").insertBefore(showMeArtists, document.getElementById("loginspotify"));

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
        type: "post",
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
                    var parsedData = JSON.parse(data);
                    if(parsedData.length !=  1){
                        // Om JSON.parse(data) blir 1 så innerbär det att den bara innehåller MetroID,
                        // Då vill vi inte skriva ut något, utan bara berätta att det ej finns några konserter här.
                    placeConcertsOnMap(parsedData);

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
            //objects.map.setOptions({draggableCursor: 'url(pic/openhand.ico), move'});
            prepareLoadingScreen();

        }
    });




}
apiIsDownErrorScreen = function(){
    var overlay = document.createElement("div");
    overlay.id = "ApiErroOverlay";

    document.body.insertBefore(overlay, document.getElementById("mapcanvas"));

}

checkApiStatus = function(){
    $.ajax({
        type: "get",
        url: "getstuff.php",
        async: true,
        data: {function: "checkStatusOnApi"},
        success: function(data){
            var parsedData = JSON.parse(data);
            if(parsedData.spotifyStatus == "fail" || parsedData.songKickStatus == "fail" || !(typeof google === 'object') || !(typeof google.maps === 'object')){
                //här kontrollerar vi så att våra Apier är som de ska.
                //Kontrollerar Sonkick och Google..
                apiIsDownErrorScreen();
                throw new Error("Något är fel på songkick eller google!");

            }

        }
    });
}

getConcertsFromCache = function(){

    if(objects.userPosition !== null){
    //Cache hämtas bara om geoLocation är satt. Då kan vi räkna ut ett område att hämta datan från..

        //Med google maps skapar vien cirkel som ska sträcka sig över en viss radie,
        //Då kan vi hämta ut data som kan hjälpa oss att hämta data som är indom den radien (radie, är det rätt ord?)


        objects.myPositionMarker = new google.maps.Marker({
            map: objects.map,
            position: new google.maps.LatLng(objects.userPosition.k, objects.userPosition.D),
            title: 'Norrköping'
        });

        objects.myPositionCicle = new google.maps.Circle({
            map: objects.map,
            radius: 1000 * 200,    // 20mil
            fillColor: '#AA0000'
        });
        objects.myPositionCicle.bindTo('center', objects.myPositionMarker, 'position');

        var bounds = objects.myPositionCicle.getBounds()

        var TopOfCircle = bounds.getNorthEast().k;
        var BottomOfCircle = bounds.getSouthWest().k;
        var LeftOfCircle = bounds.getSouthWest().D;
        var rightOfCircle = bounds.getNorthEast().D;

        objects.myPositionMarker.setVisible(false);
        objects.myPositionCicle.setMap(null);

        google.maps.event.addListener(objects.myPositionCicle, "rightclick", function(event){

            google.maps.event.trigger(objects.map, 'rightclick', event);
        });

        //exempel för uträkning av "Vad finns inne i cirkeln"
        /*var XnrkLat = 58.43048192568003;
        var YnrkLng = 15.66375732421875;

        if(XnrkLat <  TopOfCircle    && YnrkLng <  rightOfCircle &&
           XnrkLat >  BottomOfCircle && YnrkLng >  LeftOfCircle){

                alert();

        }*/

        prepareLoadingScreen();
        $.ajax({
            type: "get",
            url: "getstuff.php",
            async: true,
            data: {function: "getLocationsFromCache", top:TopOfCircle, bottom:BottomOfCircle,left:LeftOfCircle, right:rightOfCircle},//, lat: objects.userPosition.k, lng : objects.userPosition.D},
            success: function(data){
                localStorage["CachadeKonserter"] = data;

                var parsedData = JSON.parse(data);

                data = parsedData;//.data; <- onödigt men bara omskriven kod..

                var ArrayOfLocationsWithConcerts = data;//JSON.parse(data);
                FastPlaceConcertWithArrayOfLocationsWithConcerts(ArrayOfLocationsWithConcerts);
            }
        });
    }else{
        prepareLoadingScreen();
    }

}
FastPlaceConcertWithArrayOfLocationsWithConcerts = function(ArrayOfLocationsWithConcerts){
    //Larvigt namn, jag vet... denna funkion är bara en liten utbrytning...
    for(var i = 0; i < ArrayOfLocationsWithConcerts.length; i++){
        var ConcertArrayData = JSON.parse(ArrayOfLocationsWithConcerts[i].LocationJson);
        placeConcertsOnMap(ConcertArrayData);
    }

    //När denna är klar så har alla markers skrivit ut på kartan,
    // om det inte finns något på din position så ska det hämtas.
    getConcertsNearYourLocation();

}
placeConcertsOnMap = function(ConcertData){

    if(objects.LocationMapMetroIDOnMap.indexOf(ConcertData[ConcertData.length]) == -1){ // ConcertData[ConcertData.length] == MetroID
        //Om det är första gången denna location trycts på så ska den läggas in, nästa gång så ska den ej skrivas ut..
        objects.LocationMapMetroIDOnMap.push(ConcertData[ConcertData.length-1]);
        //delete ConcertData.LocationMapMetroID;
        ConcertData.pop(ConcertData.length); //Tar bort sista i arrayen, alltså MetroID't...

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
        maxWidth: 500,
        minWidth: 500,
        maxHeight: 320,
        minHeight: 100,
        backgroundColor: "rgb(162, 200, 236)"

    });

    var newWindowButton = document.createElement("input");
    newWindowButton.setAttribute("type", "submit");
    var id = ConcertData.id;
    newWindowButton.setAttribute("id", id);
    newWindowButton.style.display = "none";
    newWindowButton.setAttribute("value", ConcertData.displayName);
    newWindowButton.infoWindow = infoWindowForOtherInfoWindow;
    newWindowButton.marker = markerToUse;

    //Om markern är undefined så har det skett ett allvarligt fel,
    //, det kan vara att det är omöjligt att få tag på en exakt location av en spelning
    //Möjligtvis är det ett event som inte fått all nödvändig data,
    //Vi hoppar över sådanna event genom att använda denna if-sats..
    if(markerToUse != undefined){
        markerToUse.infoWindow.eventTypes.push(ConcertData.type);
        markerToUse.arrOfArtists.push(ConcertData.performance);

        var strToAddToEnd = "</div></div>"; //Detta görs för att Sätta innehållet inom en divtagg...
        if(markerToUse.infoWindow.content.slice(markerToUse.infoWindow.content.length-12) === "</div></div>"){
            markerToUse.infoWindow.content = markerToUse.infoWindow.content.slice(0, markerToUse.infoWindow.content.length-12);
        }

        //Vill inte ha med datum om datum finns...
        if(ConcertData.displayName.indexOf(" (") == -1){
            displayName = ConcertData.displayName;
        }else{
            displayName = ConcertData.displayName.substr(0,ConcertData.displayName.indexOf(" ("));
        }
        //få ut eventtypen
        var eventTyp = (ConcertData.type === "Concert") ? "Konsert" :  ConcertData.type;

       var dateToUse = isDateTodayOrNear(ConcertData.start.date)

        var DateMark;
        if(dateToUse === "IDAG!!! "){
            DateMark = "style='background-color: rgb(252, 79, 79)'"
            markerToUse.setAnimation(google.maps.Animation.BOUNCE);
            objects.ConcertsTodayMarkers.push(markerToUse);
        }else if(dateToUse === "Imorgon! "){
            DateMark = "style='background-color: rgb(221, 255, 68)'"
        }else{
            DateMark = "";
        }

        var arrWithTimes = getTimeFromConcertData(ConcertData);

        var time = arrWithTimes[0];
        var endtime = arrWithTimes[2];
        var endDate = arrWithTimes[1];

        markerToUse.infoWindow.setContent(markerToUse.infoWindow.content +
            '<div class="eventOfBox" ><a class="concertPlus" '+DateMark+' onclick="document.getElementById(\''+ id +'\').click();return false;" ><div class="eventHeaderMultiMarker">'+displayName+'</div> <div class="eventType"><p class="eventTypeHeader">Typ av event: </p><p class="eventTypeContent">'+ eventTyp + '</p></div>' +
            '<div class="DateOfEvent"><p class="eventContentHeader">'+'Eventstart: </p><p class="JustDateFrom">'+dateToUse + ' ' +time+ '</p> <p class="ToOwnLine">till</p> <p class="JustDateFrom">'+endDate +' '+ endtime+'</p></div>' +
            '</a></div>'+strToAddToEnd);

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

function isDateTodayOrNear(dateTocheckAgainst){
    var today = new Date();//Skrev denna och undre raden själv, lite stolt... hehe. Nu kan jag jämföra med datan från ConcertData! :D
    var todayDate = today.getFullYear().toString() + "-" + ((today.getMonth() +1 < 10) ? "0" + (today.getMonth()+1).toString() : (today.getMonth()+1).toString()) + "-" + ((today.getDate() < 10) ? "0" + today.getDate().toString() : today.getDate()).toString();
    var Tomorrow = new Date(today);
    Tomorrow = new Date(Tomorrow.setDate(today.getDate()+1));
    var tomorrowDate = Tomorrow.getFullYear().toString() + "-" + ((Tomorrow.getMonth() +1 < 10) ? "0" + (Tomorrow.getMonth()+1).toString() : (Tomorrow.getMonth()+1).toString()) + "-" + ((Tomorrow.getDate() < 10) ? "0" + Tomorrow.getDate().toString() : Tomorrow.getDate()).toString();
    //om det är dagens dag
    var dayToUse;
    if((dateTocheckAgainst === todayDate)){
        dayToUse = "IDAG!!! "
    }else if(dateTocheckAgainst === tomorrowDate){
        dayToUse = "Imorgon! "
    }else{
        dayToUse = dateTocheckAgainst;
    }
    return dayToUse;
}

function MakeMultiMarker(positions){

    var InfoWindowContent =
        '<div class="MultiBoxHeader">' +
            '<h1>Samtliga event händer här:</h1>' +
        '</div>'+
        '<div class="content">' +
            '<div class="insideContent">'; //Konstigt? hm, ne. Detta är så att jag lättare kan schystera CSS...

    var infoWindowForMarker = new InfoBubble({
        content: InfoWindowContent,
        maxWidth: 500,
        minWidth: 500,
        maxHeight: 320,
        minHeight: 100,
        paddingLeft: 20,
        backgroundColor: "rgb(162, 200, 236)",
        eventTypes : []
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
        sameLatNLngID : positions[2],
        arrOfArtists : []
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
        preformances += "<div class='ArtistBox'><a href='"+ConcertData.performance[j].artist.uri+"'>"+"<p>"+ConcertData.performance[j].displayName+"</p></a></div>";
    }


    if(ConcertData.displayName.indexOf(" (") == -1){
        displayName = ConcertData.displayName;
    }else{
        displayName = ConcertData.displayName.substr(0,ConcertData.displayName.indexOf(" ("));
    }

    var arrWithTimes = getTimeFromConcertData(ConcertData);

    var time = arrWithTimes[0];
    var endtime = arrWithTimes[2];
    var endDate = arrWithTimes[1];


    var eventContent;
    if(preformances.length == 0){
        eventContent = "<h3>Inga bestämda uppträdanden</h3>";
    }else{
        eventContent = '<h3>Uppträdanden:</h3>'+ preformances;
    }

    var eventTyp = (ConcertData.type === "Concert") ? "Konsert" :  ConcertData.type;
    var status = (ConcertData.status === "ok") ? "Fortfarande planerat" : (ConcertData.status === "cancelled")  ? "Avbokad" : "Okänt..";
    var ageRestriction = (ConcertData.ageRestriction === null) ? "Ingen gräns (enligt Songkick)" :  ConcertData.ageRestriction;
    var plats = ConcertData.venue.displayName = (ConcertData.venue.displayName == null) ? "okänt för närvarande" : ConcertData.venue.displayName;
    var dateToUse = isDateTodayOrNear(ConcertData.start.date);

    var DateMark;
    if(dateToUse === "IDAG!!! "){
        DateMark = "style='background-color: rgb(252, 79, 79)'"
    }else if(dateToUse === "Imorgon! "){
        DateMark = "style='background-color: rgb(221, 255, 68)'"
    }else{
        DateMark = "";
    }

    if(status !== "cancelled"){
        eventStatus = "/pic/onGoing.png"
    }else{
        eventStatus = "/pic/Cancelled.png"
    }

    var EventTyp = "<h2>Eventtyp: "+ "" +"</h2>"

    var InfoWindowContent =
        '<div class="content">'+
            '<div class="EventHeader">'+
            '<h1 id="firstHeading" class="firstHeading">'+displayName+'</h1>' +
            '</div>'+
            /*'<div id="bodyContent">'+*/
            '<div class="eventInfo">'+
                '<div class="EventInfoBoxes">'+
                '<div class="EventContent" ><h2>Eventtyp: '+'</h2><p>'+eventTyp+'</p></div>' +
                '<div class="EventContent"><h2>Åldersgräns: </h2><p>'+ageRestriction+'</p></div>' +
                '<div class="EventContent" ><h2>Status: </h2><p>'+status+'</p></div>' +
                '<div class="EventContent"><h2>Plats: </h2><p>'+plats+'</p></div>'+
                '<div class="EventContent" '+DateMark+'><h2>Tid och Datum: </h2><p>'+dateToUse + ' ' +time +' till ' + endDate + ' ' + endtime + '</p></div>' +
                '</div>' +
            '</div>'+
            '<div class="preformances">' + eventContent + '</div>' +
    '<h3><a href='+ConcertData.uri+'>Biljetter och mer info här!</a></h3>'
    /*'</div>'+*/
    '</div>';
    return InfoWindowContent;
}

function getTimeFromConcertData(ConcertData){
    var time = ConcertData.start.time;
    var endtime = (ConcertData.end !== undefined) ? ConcertData.end.time : "inget bestämt";
    var endDate = (ConcertData.end !== undefined) ? ConcertData.end.date : "inget bestämt";
    if(endtime == null || endtime === "inget bestämt"){
        endtime = "";
    }
    if(time == null){
        time = "";
    }
    return [time, endDate, endtime];
}

function Single_MakeMarkerAndInfoWindowOfConcertData(ConcertData){ //tar hand om Konsärer som inte har unika positioner

    var InfoWindowContent = createInfoWindowWithConcertData(ConcertData);

    var infoWindowForMarker = new InfoBubble({
        content: InfoWindowContent,
        maxWidth: 500,
        minWidth: 500,
        maxHeight: 320,
        minHeight: 100,
        paddingLeft: 20,
        backgroundColor: "rgb(162, 200, 236)",
        eventType : ConcertData.type
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
        arrOfArtists : ConcertData.performance
    });
    objects.markers.push(ConcertMarker);

    var dateToUse = isDateTodayOrNear(ConcertData.start.date)

    var DateMark;
    if(dateToUse === "IDAG!!! "){
        DateMark = "style='background-color: rgb(252, 79, 79)'"
        ConcertMarker.setAnimation(google.maps.Animation.BOUNCE);
        objects.ConcertsTodayMarkers.push(ConcertMarker);
    }else if(dateToUse === "Imorgon! "){
        DateMark = "style='background-color: rgb(221, 255, 68)'"
    }else{
        DateMark = "";
    }


    google.maps.event.addListener(ConcertMarker, 'click', function(){

        if(objects.lastOpenWindow != null){
            objects.lastOpenWindow.close();
        }

        ConcertMarker.infoWindow.open(objects.map, ConcertMarker);

        objects.lastUsedMarker = ConcertMarker;
        objects.lastOpenWindow = ConcertMarker.infoWindow;

    });
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
                var name = localStorage["UserID"];
                localStorage[name + "ArtistArr"] = data;

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

function stopAllAnimations(){
    for(var i = 0; i < objects.MultiMarkers.length; i++){
        objects.MultiMarkers[i].setAnimation(null);

    }
    for(var i = 0; i < objects.markers.length; i++){

        objects.markers[i].setAnimation(null);
    }
}

function showAllFestivals(){
    for(var i = 0; i < objects.MultiMarkers.length; i++){
        for(var j = 0; j < objects.MultiMarkers[i].infoWindow.eventTypes.length; j++){
            if(objects.MultiMarkers[i].infoWindow.eventTypes[j] === "Festival"){
                objects.MultiMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
            }
        }

    }
    for(var i = 0; i < objects.markers.length; i++){
        if(objects.markers[i].infoWindow.eventType === "Festival"){
            objects.markers[i].setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}

function showAllTodaysConcerts(){
    for(var i = 0; i < objects.ConcertsTodayMarkers.length; i++){
        objects.ConcertsTodayMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
    }
}

function spotifyFunctionSomething(){
    var artistsFromSpotify = JSON.parse(localStorage[localStorage["UserID"] + "ArtistArr"]);
    //var artistsFromCache = JSON.parse(localStorage["CachadeKonserter"]);

    var IntrestingArtistArr = [];

    var artistEventJSonList;

    for(var i = 0; i < objects.markers.length; i++){

        for(var j=0; j< objects.markers[i].arrOfArtists.length;j++){
            for(var k =0; k< artistsFromSpotify.length;k++){
                if(objects.markers[i].arrOfArtists[j].displayName == artistsFromSpotify[k][0]){
                    //alert(objects.markers[i].arrOfArtists[j].displayName);
                    objects.markers[0].setAnimation(google.maps.Animation.BOUNCE)
                }
            }
        }

    }

    for(var i = 0; i < objects.MultiMarkers.length;i++){
        for(var j=0; j< objects.MultiMarkers[i].arrOfArtists.length;j++){
            for(var l = 0; l < objects.MultiMarkers[i].arrOfArtists[j].length; l++){
                for(var k =0; k< artistsFromSpotify.length;k++){
                    if(objects.MultiMarkers[i].arrOfArtists[j][l].displayName == artistsFromSpotify[k][0]){
                        //alert(objects.MultiMarkers[i].arrOfArtists[j][l].displayName);
                        objects.MultiMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
                    }
                }
            }
        }
    }





    /*for(var i = 0 ; i < artistsFromCache.length; i++ ){
     artistEventJSonList = JSON.parse(artistsFromCache[i].LocationJson);
     for(var j = 0; j< artistEventJSonList.length;j++ ){
     var eventToCheck = artistEventJSonList[j];

     if(!(typeof(eventToCheck) == "number")){
     for(var k=0; k< eventToCheck.performance.length; k++){

     var artistToCheck = eventToCheck.performance[k].displayName;

     for(var l=0;l< artistsFromSpotify.length; l++){
     if(artistToCheck === artistsFromSpotify[l][0]){
     alert(artistToCheck);
     }
     }
     }
     }



     }
     }*/


}

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
