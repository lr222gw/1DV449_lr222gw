
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


var ShowTodaysConcertListObj = document.createElement("li");

var ShowTodaysConcertButton = document.createElement("button");
ShowTodaysConcertButton.setAttribute("id", "showConcertsPlayingToday");
ShowTodaysConcertButton.innerHTML = "Visa konserter som spelar idag";
ShowTodaysConcertButton.onclick = function(){
    if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
        document.getElementById("hideOrShow").click();
    }
    stopAllAnimations();
    setTimeout(function(){
        showAllTodaysConcerts();
    },200)
}
ShowTodaysConcertListObj.appendChild(ShowTodaysConcertButton);
//document.getElementById("logga").appendChild(ShowTodaysConcertListObj);

var ShowFestivalsListObj = document.createElement("li");
var ShowFestivalsButton = document.createElement("button");
ShowFestivalsButton.setAttribute("id", "ShowFestivals");
ShowFestivalsButton.innerHTML = "Visa Festivalevent på kartan";
ShowFestivalsButton.onclick = function(){
    if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
        document.getElementById("hideOrShow").click();
    }
    stopAllAnimations();
    setTimeout(function(){
        showAllFestivals();
    },200)

}

ShowFestivalsListObj.appendChild(ShowFestivalsButton);

document.getElementById("menuItems").appendChild(ShowFestivalsListObj);
document.getElementById("menuItems").appendChild(ShowTodaysConcertListObj);

$(function(){
    $('menuTitle').click(toggleSubItems);
});

function toggleSubItems(){
    $('menuTitle').parentNode.not($(this).children('menuTitle').parentNode).hide();
    $(this).children('menuTitle').parentNode.toggle(400);
}


var searchBox = document.createElement("input");
searchBox.setAttribute("id", "searchBox");
searchBox.setAttribute("type", "search");
searchBox.setAttribute("placeholder", "Sök efter Plats eller Artist...");
searchBox.innerHTML = "Sök Platser";

document.getElementById("logga").appendChild(searchBox);

document.getElementById("searchBox").addEventListener("keydown", function(e) {
    if (!e) { var e = window.event; }

    /*if(document.getElementById("divForArrow") === null){
        var imageArrow = document.createElement("img");
        imageArrow.setAttribute("id", "arrowForArtist");
        imageArrow.setAttribute("src", "/pic/arrowForArtist.png");
        var DivImageArrow = document.createElement("div");
        DivImageArrow.setAttribute("id", "divForArrow");
        DivImageArrow.appendChild(imageArrow);
        DivImageArrow.innerHTML += "<p id='arrowText'>Tryck på knappen för att söka artister!</p>";
        document.getElementById("logga").insertBefore(DivImageArrow, document.getElementById("searchArtistButton").nextSibling);
    }*/

    // Enter is pressed
    if (e.keyCode == 13) { window.setTimeout(function () {
        /*document.getElementById("divForArrow").parentNode.removeChild(document.getElementById("divForArrow"));*/
        document.getElementById('searchLocationButton').click();
    }, 0);  }
}, false);



var searchLocationButton = document.createElement("button");
searchLocationButton.setAttribute("id", "searchLocationButton");
searchLocationButton.innerHTML = "Sök Platser";
searchLocationButton.onclick = function(){
    var searchBoxContent = document.getElementById("searchBox").value;
    if(searchBoxContent.trim() !== "" ){
        if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
            document.getElementById("hideOrShow").click();
        }
        prepareLoadingScreen("Sökknappen för platser trycktes");
        searchLocation(searchBoxContent);
    }

}
document.getElementById("logga").appendChild(searchLocationButton);

var searchArtistButton = document.createElement("button");
searchArtistButton.setAttribute("id", "searchArtistButton");
searchArtistButton.innerHTML = "Sök Artist";
searchArtistButton.onclick = function(){
    var searchBoxContent = document.getElementById("searchBox").value;
    if(searchBoxContent.trim() !== "" ){

        searchArtists(searchBoxContent);
    }

}
document.getElementById("logga").appendChild(searchArtistButton);


var AboutButton = document.createElement("button");


var onclickRegular = function(target){
    if(document.getElementById("searchResult") !== null && target !== document.getElementById("searchResult")){
        document.getElementById("searchResult").parentNode.removeChild(document.getElementById("searchResult"));
    }
}
document.onclick = function(e){
    onclickRegular(e.target);
}
document.ontouch = function(e){
    onclickRegular(e.target);
}

AboutButton.id = "aboutSite";
AboutButton.innerHTML = "<p>Om Sidan</p>";

AboutButton.onclick = function(){
    var AboutDiv = document.createElement("div");
    AboutDiv.id = "aboutSiteDiv";
    AboutDiv.innerHTML = "" +
        "<div id='AboutContentBox'><h1>Om Sidan</h1>" +
        "<p>Konsertkartan.com är en gratis tjänst byggd med GoogleMaps Api och Songkicks Api. Tjänsten täcker Europa och Amerika.</p>" +
        "<p>Konsertkartan.com är till för att hjälpa dig att hitta ett musikevent (konsert, festival, etc) i närheten av dig,</p>" +
        "<p>eller på ett ställe där du är nyfiken att kika efter event på. Kanske ska du åka utomlands och snabbt vill se exakt vart</p>" +
        "<p>du kan hitta festivaler och konserter i närheten av ditt hotell.</p>" +
        "<p>Vad ska jag mer skriva här? Hoppas du har kul med sidan! :)</p>" +
        "<p class='italicWierd'>(Ursäkta grammatiken, energidrycken tog slut och jag var trött...)</p>" +
        "<p class='thanksTo'>Tack till, för följande resurser:</p>" +
        "<p class='thanksTo'>Songkick.com, För datan om konserter och event som dom står för.</p>" +
        "<p class='thanksTo'>Nicolas Mollet, För ikonen till kartmarkören.</p>" +
        "<p class='thanksTo'>Google Maps, För kartan och dess funktioner.</p>" +
        "<p class='thanksTo'>Spotify, För att ta fram intressanta artister till användare och tar hand om användarinloggning.</p>" +
        "<p class='contactMe'>Vill du kontakta mig av någon anledning är min Email här: <address><a href='mailto:lowe.raivio@gmail.com'>lowe.raivio@gmail.com</a></address></p>" +
        "<div id='songkickstuff'><a href='http://www.songkick.com'><img src='pic/songkick.png'></a></div>" +
        "<p>PS. Sidan använder Cookies och Localstorage... Men det har du redan accepterat, skriver det här bara för att ha det på två ställen...</p>" +
        "<p>PPS. Sidan funkar bäst med Google Chrome-webbläsaren...</p>" +
        "</div>";

    var CloseButton = document.createElement("button");
    CloseButton.id = "closeAboutScreen";
    CloseButton.innerHTML = "Stäng mig";
    CloseButton.onclick = function(){
        document.getElementById("aboutSiteDiv").parentNode.removeChild(document.getElementById("aboutSiteDiv"));
    }
    AboutDiv.appendChild(CloseButton);
    var StartToturialButton = document.createElement("button");
    StartToturialButton.id = "startBasicGuide";
    StartToturialButton.innerHTML = "Kör Guiden!";
    StartToturialButton.onclick = function(){
        document.getElementById("aboutSiteDiv").parentNode.removeChild(document.getElementById("aboutSiteDiv"));
        basicTutoral();
    }
    AboutDiv.appendChild(StartToturialButton);


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
var checkBox = document.createElement("input");
checkBox.type = "checkbox";
checkBox.id = "AutoCloseCheck";
if(localStorage["autoHide"] !== "false"){
    checkBox.checked = "true";
    localStorage["autoHide"] = "true";
}
checkBox.onchange = function(e){
    /*if(e.target.checked === "false"){
        localStorage["autoHide"] = "false";
    }else{
        localStorage["autoHide"] = "false";
    }*/
    if(e.target.checked === true){
        localStorage["autoHide"] = "true";
    }else{
        localStorage["autoHide"] = "false";
    }
}

var divForCheckbox = document.createElement("div");
divForCheckbox.id = "CheckBoxDiv";
divForCheckbox.innerHTML = "<p id='checkBoxP'>Auto Dölj</p>";
divForCheckbox.appendChild(checkBox);
document.getElementById("logga").appendChild(divForCheckbox)






$.ajax({
    type: "get",
    url: "getstuff.php",
    async: true,
    data: {function: "isUserOnline"},
    success: function(data){
        localStorage["isOffline"] = "false";
        if(data !== "false"){
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
                if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
                    document.getElementById("hideOrShow").click();
                }
                stopAllAnimations();
                populateUserWithArtistData();

            }
            var pTagg = document.createElement("p");
            pTagg.innerHTML = "Visa relevanta artister";
            showMeArtists.appendChild(pTagg);

            var toolTipSpan = document.createElement("span");
            toolTipSpan.innerHTML = "<p>Visar konserter av dina intressen.</p> <p>(av dom som syns på kartan)</p><p>Hämta konserter genom att <b>högerklicka</b> på plats av intresse.</p> <p>:)</p>";
            showMeArtists.appendChild(toolTipSpan);
            document.getElementById("logga").insertBefore(showMeArtists, document.getElementById("loginspotify"));

            localStorage["UserID"] = data;



            var usersFavoriteCitiesButton = document.createElement("input");
            usersFavoriteCitiesButton.setAttribute("value", "Dina Favoritplatser");
            usersFavoriteCitiesButton.setAttribute("type", "submit");
            usersFavoriteCitiesButton.setAttribute("id", "favoritCityButton");
            usersFavoriteCitiesButton.onclick = function(){
                if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
                    document.getElementById("hideOrShow").click();
                }
                getUsersTownsDiv();
            }
            PopulateUsersTowns();

            document.body.insertBefore(usersFavoriteCitiesButton, document.getElementById("myFavoriteTowns"));


        }else{
            localStorage["UserID"] = "notOnline";
        }
    },
    error : function(){
        //Om vi kommer hit så är anslutningen nere. då ska vi ändra allt till offline läge...
        localStorage["isOffline"] = "true";
        prepareLoadingScreen();//stänger av laddningen
        setStuffOffline();
    }
});

setStuffOffline = function(){
    document.getElementById("loginButton").disabled = true;
    document.getElementById("loginButton").style.backgroundColor = "grey";
    document.getElementById("searchLocationButton").style.backgroundColor = "grey";
    document.getElementById("searchArtistButton").style.backgroundColor = "grey"
    var message = document.createElement("div")
    message.setAttribute("id", "offlineMessage")
    message.innerHTML = "<h1>Du är offline, sidan är offline</h1><p>Hejsan kära användare, det verkar som du är offline.</p><p>Konsertkartan behöver internetuppkoppling för att kunna hämta data, tyvärr får vi inte cacha datan längre än i ett par timmar, så vi kan inte heller lista den här.</p><p>Vänligen kom tillbaka när ditt internet har uppkoppling igen :)</p>" +
        "<p>Men om du väldigt gärna vill kan du gå in och läsa om sidan eller köra guiden.</p>"
    document.body.insertBefore(message, document.getElementById("myFavoriteTowns"));
}

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

firstTimeTutorial = function(){
    var tutorialdiv = document.getElementById("tutorial");
    tutorialdiv.style.display = "block";
    tutorialdiv.innerHTML = '' +
        '<div id="tutorialContent">' +
        '<h1>Hej och välkommen till KonsertKartan.com!</h1>' +
        '<p>Detta är första gången du besöker sidan va? Då ska vi bara gå över ett par saker.</p>' +
        '<p class="unnecessaryBusiness">För det första, Sidan använder Cookies och LocalStorage. PGA svensk lag så måste jag berätta det.<p>(majoriteten av sidor på nätet berättar inte sånt, då ingen egentligen bryr sig...)</p> </p>' +
        '<button id="agreeButton">Jag fattar och godkänner, cookies/localStorage används...</button>' +
        '' +
        '</div>';
    document.getElementById("agreeButton").onclick = function(){
        document.getElementById("tutorial").style.display = "none";
        localStorage["hasDoneTutorial"] = "done";
        basicTutoral();
    }
}
basicTutoral = function(){
    var tutorialdiv = document.getElementById("tutorial");
    tutorialdiv.style.display = "block";
    tutorialdiv.innerHTML = '' +
        '<div id="tutorialContent">' +
        '<h1>Basics 1/4 - Hämta konserter från en stad!</h1>' +
        '<img class="basicGuideImg" src="pic/tutorialpics/GIFRightClickORTouch.gif">' +
        '<p>Du kan hämta event från en plats på två sätt, det ena är att söka efter platsen.</p>' +
        '<p>Det andra är att högerklicka (håll in i 1.5 sec på touchmobil) på en stad på kartan som du vill hämta ifrån.</p>' +
        '<button id="NextButton">Ok, fattar, hämtar event med höger/håll in...</button>' +
        '' +
        '</div>';
    document.getElementById("NextButton").onclick = function(){
        document.getElementById("tutorial").innerHTML = '' +
            '<div id="tutorialContent">' +
            '<h1>Basics 2/4 - Markera festivaler eller konserter som spelar idag!</h1>' +
            '<img class="basicGuideImg" src="pic/tutorialpics/GIF-hoppandepilar.gif">' +
            '<p>Om du snabbt vill se vilka event som pågår eller ska börja idag kan du välja "markera..." och sen alternativ.</p>' +
            '<p>Det är viktigt att veta; bara de markörer på kartan som du redan ser kommer att röra sig.</p>' +
            '<p>(Exempel: om du bara ser markörer från linköping och trycker på "visa festivaler" så kommer du ej se festivaler från norrköping)</p>' +
            '<button id="NextButton">Ok, bara markörer som syns dansar...</button>' +
            '' +
            '</div>';
        document.getElementById("NextButton").onclick = function(){
            document.getElementById("tutorial").innerHTML = '' +
                '<div id="tutorialContent">' +
                '<h1>Basics 3/4 - Dina favoritstäder!</h1>' +
                '<img class="basicGuideImg" src="pic/tutorialpics/MyTowns.gif">' +
                '<p>Om du är inloggad har du tillgång till ett par saker. Du kan snabbt se artister av ditt intresse i närheten (det du lyssnar på genom spotify).</p>' +
                '<p>Du kan också lägga till favoritplatser, från dessa kommer det automatiskt att hämtas event från när du loggar in.</p>' +
                '' +
                '<button id="NextButton">ok, Bra att logga in med spotify, got it!...</button>' +
                '' +
                '</div>';
            document.getElementById("NextButton").onclick = function(){
                document.getElementById("tutorial").innerHTML = '' +
                    '<div id="tutorialContent">' +
                    '<h1>Basics 4/4 - Kolla innehållet på event!</h1>' +
                    '<img class="basicGuideImg" src="pic/tutorialpics/PNgonclick.png">' +
                    '<p>Tryck på markör för att se innehållet av eventet.</p>' +
                    '<p>Markören med en grön "+"-symbol (multi markör) visar att detta är en plats där flera event kommer hållas, trycker man på den får man en lista över eventen.</p>' +
                    '<p>Markören som saknar "+"-symbolen (singel markör) visar eventet och artisterna som kommer, detta syns även om du klickar på ett event i multi markörens lista får du samma info</p>' +
                    '' +
                    '<button id="NextButton">ok, hade nog klarat mig utan guide. Men ok!</button>' +
                    '' +
                    '</div>';
                document.getElementById("NextButton").onclick = function(){
                    document.getElementById("tutorial").style.display = "none";
                }
                var cancel = document.createElement("button");
                cancel.innerHTML = "Jag vill inte ha någon tutorial, jag kan väl själv..."
                cancel.setAttribute("id", "cancelToturial")
                cancel.onclick = function(){
                    document.getElementById("tutorial").style.display = "none";
                }
                document.getElementById("tutorial").appendChild(cancel);
            }
            var cancel = document.createElement("button");
            cancel.innerHTML = "Jag vill inte ha någon tutorial, jag kan väl själv..."
            cancel.setAttribute("id", "cancelToturial")
            cancel.onclick = function(){
                document.getElementById("tutorial").style.display = "none";
            }
            document.getElementById("tutorial").appendChild(cancel);
        }
        var cancel = document.createElement("button");
        cancel.innerHTML = "Jag vill inte ha någon tutorial, jag kan väl själv..."
        cancel.setAttribute("id", "cancelToturial")
        cancel.onclick = function(){
            document.getElementById("tutorial").style.display = "none";
        }
        document.getElementById("tutorial").appendChild(cancel);
    }
    var cancel = document.createElement("button");
    cancel.innerHTML = "Jag vill inte ha någon tutorial, jag kan väl själv..."
    cancel.setAttribute("id", "cancelToturial")
    cancel.onclick = function(){
        document.getElementById("tutorial").style.display = "none";
    }
    document.getElementById("tutorial").appendChild(cancel);
}

getUsersTownsDiv = function(){
    if(localStorage["isOffline"] !== "true"){
        var townDiv = document.getElementById("myFavoriteTowns");
        townDiv.style.transition = "right 1s ease-in-out 0s";
        townDiv.style.right = "0%";
        if(document.getElementById("cancelCityButton") === null){

            var TownfieldOne = document.createElement("input");
            TownfieldOne.setAttribute("type", "text");
            TownfieldOne.setAttribute("id", "TownfieldOne");

            var TownfieldTwo = document.createElement("input");
            TownfieldTwo.setAttribute("type", "text");
            TownfieldTwo.setAttribute("id", "TownfieldTwo");

            var TownfieldThree = document.createElement("input");
            TownfieldThree.setAttribute("type", "text");
            TownfieldThree.setAttribute("id", "TownfieldThree");

            var TownfieldFour = document.createElement("input");
            TownfieldFour.setAttribute("type", "text");
            TownfieldFour.setAttribute("id", "TownfieldFour");

            var TownfieldFive = document.createElement("input");
            TownfieldFive.setAttribute("type", "text");
            TownfieldFive.setAttribute("id", "TownfieldFive");

            townDiv.appendChild(TownfieldOne);
            townDiv.appendChild(TownfieldTwo);
            townDiv.appendChild(TownfieldThree);
            townDiv.appendChild(TownfieldFour);
            townDiv.appendChild(TownfieldFive);

            var SaveButton = document.createElement("button");
            SaveButton.setAttribute("id", "SaveCityButton")
            SaveButton.innerHTML = "Spara"
            SaveButton.onclick = function(){
                prepareLoadingScreen("GetUsersTownDiv påbörjas");
                $.ajax({
                    type: "post",
                    url: "getstuff.php",
                    async: true,
                    data: {function: "saveUsersTowns", userID : localStorage["UserID"],
                        TownOne: document.getElementById("TownfieldOne").value,
                        TownTwo: document.getElementById("TownfieldTwo").value,
                        TownThree: document.getElementById("TownfieldThree").value,
                        TownFour: document.getElementById("TownfieldFour").value,
                        TownFive: document.getElementById("TownfieldFive").value},
                    success: function(data){
                        prepareLoadingScreen("GetUsersTownDiv Avslutas");
                    }
                });
            }

            townDiv.appendChild(SaveButton);
            var cancelButton = document.createElement("button");
            cancelButton.setAttribute("id", "cancelCityButton")
            cancelButton.innerHTML = "Stäng"
            cancelButton.onclick = function(){
                var townDiv = document.getElementById("myFavoriteTowns");
                townDiv.style.transition = "right 1s ease-in-out 0s";
                townDiv.style.right = "-50%";
            }
            townDiv.appendChild(cancelButton);
        }


        getUsersTowns();
    }


}
PopulateUsersTowns = function(){
    if(localStorage["isOffline"] !== "true"){
        if(localStorage["UserID"] !== "notOnline"){
            //prepareLoadingScreen("PopulateUsersTowns påbörjas");
            $.ajax({
                type: "get",
                url: "getstuff.php",
                async: true,
                data: {function: "getUsersTowns", userID: localStorage["UserID"]},
                success: function(data){

                    if(data != "" && data != "[null]" && data !== null && data !== 'null'){

                        var parsedData = JSON.parse(data);
                        for(var i= 0 ; i < parsedData.length; i++){
                            searchLocation(parsedData[i].TownName, "ignore");
                        }
                        setTimeout(function(){
                            //prepareLoadingScreen("PopulateUsersTowns Avslutas");
                            //^Denna tar jag bort då den gör att det blir en paus i laddningen när sidan laddas...
                            console.log("favoriteTowns Populated complete! ");
                        }, 5000);

                    }
                }
            });
        }
    }

}

getUsersTowns = function(){
    if(localStorage["isOffline"] !== "true"){
        if(localStorage["UserID"] !== "notOnline"){
            prepareLoadingScreen("GetUsersTowns Påbörjas");
            $.ajax({
                type: "get",
                url: "getstuff.php",
                async: true,
                data: {function: "getUsersTowns", userID: localStorage["UserID"]},
                success: function(data){

                    if(data != "" && data != "[null]" && data !== null && data !== 'null'){

                        var parsedData = JSON.parse(data);

                        document.getElementById("TownfieldOne").value = (parsedData[0] == undefined) ? "" : parsedData[0].TownName;
                        document.getElementById("TownfieldTwo").value = (parsedData[1] == undefined) ? "" : parsedData[1].TownName;
                        document.getElementById("TownfieldThree").value = (parsedData[2] == undefined) ? "" : parsedData[2].TownName;
                        document.getElementById("TownfieldFour").value = (parsedData[3] == undefined) ? "" : parsedData[3].TownName;
                        document.getElementById("TownfieldFive").value = (parsedData[4] == undefined) ? "" : parsedData[4].TownName;

                        console.log("favoriteTowns complete! ");
                    }

                    prepareLoadingScreen("GetUsersTowns Avslutas");
                }
            });
        }
    }

}

searchArtists = function(searchTerm){
    if(localStorage["isOffline"] !== "true"){
        prepareLoadingScreen("searchArtists påbörjas");
        $.ajax({
            type: "post",
            url: "getstuff.php",
            async: true,
            data: {function: "searchArtists", searchTerm: searchTerm, metroArr: JSON.stringify(objects.LocationMapMetroIDOnMap)},
            success: function(data){

                if(data != "" && data != "[null]" && data !== null && data !== 'null'){

                    var parsedData = JSON.parse(data);

                    handleArtistData(parsedData);

                    console.log("Artist search complete! ");
                }

                prepareLoadingScreen("SearchArtist avlustas");

            }
        });
    }

}

goTroughArtistEvent = function(){

    var center = objects.artistEventFromSearch[0].getPosition();
    objects.artistEventFromSearch[0].infoWindow.open(objects.map,objects.artistEventFromSearch[0] );
    objects.map.setCenter(center);
    objects.activeArtistEventScrollerNumber = 0;
    if(document.getElementById("closePrevNext") !== null){
        document.getElementById("closePrevNext").click();
    }


    var prevEventButton = document.createElement("button");
    prevEventButton.setAttribute("id", "prevEvent");
    prevEventButton.innerHTML = "Gå till föregående event";
    prevEventButton.onclick = function(){

        if(objects.activeArtistEventScrollerNumber !== 0){
            var center = objects.artistEventFromSearch[objects.activeArtistEventScrollerNumber - 1].getPosition();
            objects.map.setCenter(center);
            objects.artistEventFromSearch[objects.activeArtistEventScrollerNumber - 1].infoWindow.open(objects.map,objects.artistEventFromSearch[objects.activeArtistEventScrollerNumber - 1] );
            objects.activeArtistEventScrollerNumber = objects.activeArtistEventScrollerNumber - 1;
        }else{
            var center = objects.artistEventFromSearch[objects.artistEventFromSearch.length -1].getPosition();
            objects.map.setCenter(center);
            objects.artistEventFromSearch[objects.artistEventFromSearch.length -1].infoWindow.open(objects.map,objects.artistEventFromSearch[objects.artistEventFromSearch.length-1] );
            objects.activeArtistEventScrollerNumber = objects.artistEventFromSearch.length -1 ;
        }



    }


    var closeNextPrevEventButton = document.createElement("button");
    closeNextPrevEventButton.setAttribute("id", "closePrevNext");
    closeNextPrevEventButton.innerHTML = "avsluta denna artist";
    closeNextPrevEventButton.onclick = function(){
        document.getElementById("searchBox").innerHTML = "";
        document.getElementById("prevEvent").parentNode.removeChild(document.getElementById("prevEvent"));
        document.getElementById("nextEvent").parentNode.removeChild(document.getElementById("nextEvent"));
        document.getElementById("nextprevcancel").parentNode.removeChild(document.getElementById("nextprevcancel"));
    }

    var nextprevcancelBox = document.createElement("div");
    nextprevcancelBox.setAttribute("id", "nextprevcancel");

    var nextEventButton = document.createElement("button");
    nextEventButton.setAttribute("id", "nextEvent");
    nextEventButton.innerHTML = "Gå till nästa event";
    nextEventButton.onclick = function(){

        if(objects.activeArtistEventScrollerNumber !== objects.artistEventFromSearch.length-1){
            var center = objects.artistEventFromSearch[objects.activeArtistEventScrollerNumber + 1].getPosition();
            objects.map.setCenter(center);
            objects.artistEventFromSearch[objects.activeArtistEventScrollerNumber + 1].infoWindow.open(objects.map,objects.artistEventFromSearch[objects.activeArtistEventScrollerNumber + 1] );
            objects.activeArtistEventScrollerNumber = objects.activeArtistEventScrollerNumber + 1;
        }else{
            var center = objects.artistEventFromSearch[0].getPosition();
            objects.map.setCenter(center);
            objects.artistEventFromSearch[0].infoWindow.open(objects.map,objects.artistEventFromSearch[0] );
            objects.activeArtistEventScrollerNumber = 0;
        }



    }
    nextprevcancelBox.appendChild(prevEventButton);
    nextprevcancelBox.appendChild(closeNextPrevEventButton);
    nextprevcancelBox.appendChild(nextEventButton);

    document.body.appendChild(nextprevcancelBox);

}

handleArtistData = function(artistsData){

    var resultDiv = document.createElement("div");
    resultDiv.setAttribute("id", "searchResult");

    for(var i = 0; i < artistsData.length; i++){
        var artistToAdd = artistsData[i];
        var aTag = document.createElement("a");
        aTag.artistId = artistToAdd.id;
        aTag.setAttribute("value", artistToAdd.displayName);
        aTag.innerHTML = artistToAdd.displayName;
        var calenderURI = artistToAdd.identifier[0];
        if(calenderURI === undefined){
            calenderURI = "noConcerts";
            aTag.innerHTML +="<p class='sorryNoPlannedEvents'>Tyvärr, denna artist har ingen aktiv eventkalender</p>";
        }else{
            calenderURI = artistToAdd.identifier[0].eventsHref;
        }
        aTag.calenderUrl = calenderURI;
        aTag.OnTourUntil = artistToAdd.onTourUntil;
        aTag.setAttribute("class", "artistSearchClass");
        aTag.onclick = function(e){

            getArtistDataFromThisArtist(e.target);
        }
        resultDiv.appendChild(aTag);
    }

    document.getElementById("topBanner").parentNode.insertBefore((resultDiv),document.getElementById("topBanner").nextSibling );

}

getArtistDataFromThisArtist = function(artistATag){
    if(localStorage["isOffline"] !== "true"){
        if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
            document.getElementById("hideOrShow").click();
        }
        prepareLoadingScreen("GetArtistDataFromThisArtist påbörjas");
        $.ajax({
            type: "post",
            url: "getstuff.php",
            async: true,
            data: {function: "getArtistEventDataFromCalenderURL", artistCalenderURL: artistATag.calenderUrl},
            success: function(data){

                if(data != "" && data != "[null]"&& data !== null && data !== 'null'){

                    var parsedData = JSON.parse(data);

                    if(parsedData !== "no Events Planned"){
                        FastPlaceArtistEvents(parsedData);
                        goTroughArtistEvent();
                        console.log("Event of artist found!");
                    }else{
                        var alert = document.createElement("div");
                        alert.innerHTML = "<p>Artisten du sökt efter har tyvärr inga planerade event! (Enligt Songkick.com) :(</p>";
                        alert.setAttribute("id", "alertBox");
                        alert.style.display = "none";
                        alert.setAttribute("title", "Det här var ju tråkigt...");
                        document.body.appendChild(alert);
                        $( "#alertBox" ).dialog();//alert("Artisten du sökt efter har tyvärr inga planerade event! (Enligt Songkick.com) :(");
                    }

                }

                prepareLoadingScreen("GetArtistDataFromThisArtist Avslutas");

            }
        });
    }

}
FastPlaceArtistEvents = function(ArrayOfArtistEvents){
    //Den här funktionen gör lite onödigt mycket... den var inte tänkt att användas såhär från början
    var arrayForPlaceConcertsOnMap = [];
    objects.artistEventFromSearch = [];
    for(var i = 0; i < ArrayOfArtistEvents.length; i++){
        arrayForPlaceConcertsOnMap.push(ArrayOfArtistEvents[i]);
        //arrayForPlaceConcertsOnMap.push(ArrayOfArtistEvents[i].id);

    }
    placeConcertsOnMap(arrayForPlaceConcertsOnMap, true);


}

searchLocation = function(searchTerm, ignoreShow){
    if(localStorage["isOffline"] !== "true"){

        //prepareLoadingScreen();
        $.ajax({
            type: "post",
            url: "getstuff.php",
            async: true,
            data: {function: "searchCity", searchTerm: searchTerm, metroArr: JSON.stringify(objects.LocationMapMetroIDOnMap)},
            success: function(data){
                setLastCheckedLocationName();
                if( data == "nope"){
                    console.log("Cant update until later! :< ");
                }else{
                    if(data != "" && data != "[null]"){
                        //console.log(data);
                        var parsedData = JSON.parse(data);
                        //var parsedData = JSON.parse(parsedData);// Det blir visst
                        if(parsedData.length !=  1){
                            // Om JSON.parse(data) blir 1 så innerbär det att den bara innehåller MetroID,
                            // Då vill vi inte skriva ut något, utan bara berätta att det ej finns några konserter här.
                            placeConcertsOnMap(parsedData);
                            if(ignoreShow !== "ignore"){
                                if(objects.MultiMarkers.length !== 0){
                                    objects.map.setCenter(new google.maps.LatLng(objects.MultiMarkers[objects.MultiMarkers.length-1].position.k, objects.MultiMarkers[objects.MultiMarkers.length-1].position.D))
                                    objects.map.setZoom(10);
                                }else{
                                    objects.map.setCenter(new google.maps.LatLng(objects.markers[objects.markers.length-1].position.k, objects.markers[objects.markers.length-1].position.D))
                                    objects.map.setZoom(10);
                                }
                                prepareLoadingScreen("SearchLocation Avslutas i If-satsen 'parsedData.length !=  1'");
                            }


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
                            prepareLoadingScreen("SearchLocation Avslutas i Else-satsen 'parsedData.length !=  1'");
                        }
                        console.log("Location Populated! :D ");
                    }else{
                        prepareLoadingScreen("SearchLocation Avslutas i Else-satsen 'data !=  && data != [null]'");

                    }

                }
                //objects.map.setOptions({draggableCursor: 'url(pic/openhand.ico), move'});


            }
        });
    }

}

prepareLoadingScreen = function(reasonForLog){
    console.log(reasonForLog);
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

setLastCheckedLocationName = function(isUsersTown){
    if(localStorage["isOffline"] !== "true"){
        $.ajax({
            type: "get",
            url: "getstuff.php",
            async: true,
            data: {function: "getLastCheckedLocationName"},
            success: function(data){

                if(document.getElementById("LastChecked") == null){
                    if(isUsersTown === true){
                        objects.usersTownPos = data;
                    }
                    var LastChecked = document.createElement("div");
                    LastChecked.setAttribute("id", "LastChecked");
                    LastChecked.innerHTML = data;
                    document.getElementById("logga").appendChild(LastChecked);
                }else{

                    document.getElementById("LastChecked").innerHTML = data;

                    if(data === "" || data === null){
                        document.getElementById("LastChecked").innerHTML = "Inga konserter hittades :(";
                    }

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

}

getConcertsNearYourLocation = function(lat, lng){
    if(localStorage["isOffline"] !== "true"){
    //namenet är lite missvisande, det den gör är att den hämtar Konserter för en viss location,
    //Om inget annat anges hämtas location från geolocation...
        if(lat !== undefined && lng !== undefined){
            prepareLoadingScreen("getConcertsNearYourLocation påbörjas");
        }

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

                var isTrueOrNot;
                if(lat === undefined && lng === undefined ){
                    isTrueOrNot = true;
                }else{ isTrueOrNot  = false;}

                setLastCheckedLocationName(isTrueOrNot);
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
                if(lat !== undefined && lng !== undefined){
                    prepareLoadingScreen("GetConcertsNearYouAvslutas");
                }


            }
        });
    }





}
apiIsDownErrorScreen = function(){
    var overlay = document.createElement("div");
    overlay.id = "ApiErroOverlay";

    document.body.insertBefore(overlay, document.getElementById("mapcanvas"));

}

checkApiStatus = function(){
    if(localStorage["isOffline"] !== "true"){
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

}

getConcertsFromCache = function(){
    if(localStorage["isOffline"] !== "true"){
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

            //prepareLoadingScreen("GetConcertsFromCache Påbörjas");
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
            //prepareLoadingScreen("GetConcertFromCache avslutas i Else-satsen 'objects.userPosition !== null'");
        }
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
placeConcertsOnMap = function(ConcertData, isSearch){

    if(objects.LocationMapMetroIDOnMap.indexOf(ConcertData[ConcertData.length]) == -1 || isSearch === true){ // ConcertData[ConcertData.length] == MetroID
        if(isSearch !== true){
            //Om det är första gången denna location trycts på så ska den läggas in, nästa gång så ska den ej skrivas ut..
            objects.LocationMapMetroIDOnMap.push(ConcertData[ConcertData.length-1]);
            //delete ConcertData.LocationMapMetroID;
            ConcertData.pop(ConcertData.length); //Tar bort sista i arrayen, alltså MetroID't...
        }


        var positionsLat = [];
        var positionsLng = [];
        var positions = [];
        var ConcertThatHasSameLatNLng = [];
        var ConcertThatDoesNotHaveSameLatNLng = [];
        var sameLatNLngID;// = 840; // används för att identifera Konsärer som har samma Lng och Lat... (används i funktionen MultiMakeMarkerAndInfoWindowOfConcertData)...
        for(var i = 0; i < ConcertData.length;i++){ //Ska hitta om det finns Konserter på Samma Position.. Om det finns = ska lösas..

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
            var marker = Single_MakeMarkerAndInfoWindowOfConcertData(ConcertThatDoesNotHaveSameLatNLng[i]);
            if(isSearch){
                objects.artistEventFromSearch.push(marker);
            }
        }

        for(var i = 0; i < positions.length; i++){
            var marker = MakeMultiMarker(positions[i]);
            if(isSearch){
                objects.artistEventFromSearch.push(marker);
            }
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
            DateMark = "style='background-color: rgb(187, 155, 0)'"
        }else{
            DateMark = "";
        }

        var arrWithTimes = getTimeFromConcertData(ConcertData);

        var time = arrWithTimes[0];
        var endtime = arrWithTimes[2];
        var endDate = arrWithTimes[1];

        markerToUse.infoWindow.setContent(markerToUse.infoWindow.content +
            '<div class="eventOfBox" ><a class="concertPlus" '+DateMark+' onclick="document.getElementById(\''+ id +'\').click();  return false;" ><div class="eventHeaderMultiMarker">'+displayName+'</div> <div class="eventType"><p class="eventTypeHeader">Typ av event: </p><p class="eventTypeContent">'+ eventTyp + '</p></div>' +
            '<div class="DateOfEvent"><p class="eventContentHeader">'+'Eventstart: </p><p class="JustDateFrom">'+dateToUse + ' ' +time+ '</p> <p class="ToOwnLine">till</p> <p class="JustDateFrom">'+endDate +' '+ endtime+'</p></div>' +
            '</a></div>'+strToAddToEnd);

        newWindowButton.onclick = function (e){

            if(objects.lastOpenWindow != null){
                objects.lastOpenWindow.close();
            }

            e.target.infoWindow.open(objects.map, e.target.marker);

            objects.lastUsedMarker = newWindowButton.marker;
            objects.lastOpenWindow = newWindowButton.infoWindow;

            //backbuttonstuff
            var goBackButton = document.createElement("button");
            goBackButton.setAttribute("id", "goBackButton");
            goBackButton.setAttribute("style", "display:none");
            goBackButton.parentMarker = markerToUse;
            goBackButton.windwoToClose = e.target.infoWindow;
            //goBackButton.windwoToOpen = e.target.infoWindowForClose;
            goBackButton.onclick = function(e){
                //e.target.windwoToClose.close();
                if(objects.lastOpenWindow != null){
                    objects.lastOpenWindow.close();
                }

                e.target.windwoToClose = e.target.contentWithoutButton;

                e.target.parentMarker.infoWindow.open(objects.map, e.target.parentMarker)
                //ConcertMarker.infoWindow.open(objects.map, ConcertMarker);
                document.getElementById("goBackButton").parentNode.removeChild(document.getElementById("goBackButton"));
                document.getElementById("goBackButtonHref").parentNode.removeChild(document.getElementById("goBackButtonHref"));
                objects.lastOpenWindow.content = e.target.contentWithoutButton;

                objects.lastUsedMarker = e.target.parentMarker;
                objects.lastOpenWindow = e.target.parentMarker.infoWindow;
                //e.target.windwoToOpen.open();
            }
            document.body.appendChild(goBackButton);

            var goBackButtonOnWindow = document.createElement("button");

            goBackButtonOnWindow.setAttribute("onclick",'document.getElementById(\''+ 'goBackButton' +'\').click();  return false;');
            goBackButtonOnWindow.setAttribute("id", "goBackButtonHref");
            goBackButtonOnWindow.innerHTML = "Tillbaka";
            e.target.infoWindow.contentWithoutButton = e.target.infoWindow.content;
            goBackButton.contentWithoutButton = e.target.infoWindow.content;
            e.target.infoWindow.content += goBackButtonOnWindow.outerHTML;

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
        '<div class="content">' +
        '<div class="MultiBoxHeader">' +
            '<h1>Samtliga event händer här:</h1>' +
        '</div>'+
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
        if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
            document.getElementById("hideOrShow").click();
        }
        if(objects.lastOpenWindow != null){
            objects.lastOpenWindow.close();
        }
        objects.lastMultiMarker = ConcertMarker;
        ConcertMarker.infoWindow.open(objects.map, ConcertMarker);

        objects.lastUsedMarker = ConcertMarker;
        objects.lastOpenWindow = ConcertMarker.infoWindow;

    });
    //nästa rad är bara till för att sökning ska fungera, annars ignorerars om något retuenrars...
    return ConcertMarker;
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
                '<div class="EventContent" '+DateMark+'><h2>Tid och Datum: </h2><p>'+dateToUse + ' ' +time +' till ' + endDate + ' ' + endtime + '</p></div>' +
                '<div class="EventContent" ><h2>Status: </h2><p>'+status+'</p></div>' +
                '<div class="EventContent"><h2>Åldersgräns: </h2><p>'+ageRestriction+'</p></div>' +
                '<div class="EventContent"><h2>Plats: </h2><p>'+plats+'</p></div>'+
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
        if(document.getElementById("hideOrShow").innerHTML === "DÖLJ" && localStorage["autoHide"] === "true"){
            document.getElementById("hideOrShow").click();
        }

        if(objects.lastOpenWindow != null){
            objects.lastOpenWindow.close();
        }

        ConcertMarker.infoWindow.open(objects.map, ConcertMarker);

        objects.lastUsedMarker = ConcertMarker;
        objects.lastOpenWindow = ConcertMarker.infoWindow;

    });
    //nästa rad är bara till för att sökning ska fungera, annars ignorerars om något retuenrars...
    return ConcertMarker;
}

/*var PopulatePlaylistButton = document.createElement("input");
PopulatePlaylistButton.setAttribute("value", "Logga ut, ");
PopulatePlaylistButton.setAttribute("type", "submit");*/
populateUserWithArtistData = function(){
    if(localStorage["isOffline"] !== "true"){
        prepareLoadingScreen("PopulateUserWithArtistsData påbörjas");
        $.ajax({
            type: "get",
            url: "getstuff.php",
            async: true,
            data: {function: "getUsersArtists"},
            success: function(data){
                if( data === "nope"){
                    console.log("Cant update until later! :< ");
                    spotifyFunctionSomething();
                    objects.map.setZoom(5);
                }else{
                    console.log("Artist Populated! :D ");
                    var name = localStorage["UserID"];
                    localStorage[name + "ArtistArr"] =  JSON.parse(data);
                    spotifyFunctionSomething();
                    objects.map.setZoom(5);

                }

                prepareLoadingScreen("PopulateUserWithArtistsData Avslutas");

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

//BackButton
/*
var goBackButton = document.createElement("button");
 goBackButton.setAttribute("id", "goBackButton");
 goBackButton.setAttribute("style", "display:none");
 goBackButton.parentMarker = markerToUse;
 //goBackButton.marker = e.target.marker;

 goBackButton.innerHTML = "Gå tillbaka";

 goBackButton.onclick = function(e){
 document.getElementById("goBackButton").parentNode.removeChild(document.getElementById("goBackButton"));
 document.getElementById("goBackButtonHref").parentNode.removeChild(document.getElementById("goBackButtonHref"));
 objects.lastOpenWindow.content = e.target.contentWithoutButton;
 objects.lastOpenWindow.close();
 e.target.parentMarker.infoWindow.open();
 //objects.lastMultiMarker.click();
 //document.getElementById("goBackButton").remove();
 if(objects.lastOpenWindow != null){
 objects.lastOpenWindow.close();
 }
 objects.lastMultiMarker = ConcertMarker;
 ConcertMarker.infoWindow.open(objects.map, ConcertMarker);

 objects.lastUsedMarker = ConcertMarker;
 objects.lastOpenWindow = ConcertMarker.infoWindow;
 }
 document.body.appendChild(goBackButton);
 var goBackButtonOnWindow = document.createElement("button");

 goBackButtonOnWindow.setAttribute("onclick",'document.getElementById(\''+ 'goBackButton' +'\').click();  return false;');
 goBackButtonOnWindow.setAttribute("id", "goBackButtonHref");
 goBackButtonOnWindow.innerHTML = "Tillbaka";
 e.target.infoWindow.contentWithoutButton = e.target.infoWindow.content;
 goBackButton.contentWithoutButton = e.target.infoWindow.content;
 e.target.infoWindow.content += goBackButtonOnWindow.outerHTML;
*/