<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-08
 * Time: 23:15
 */
require_once("dbstuff.php");
session_start();


if($_POST["function"] == "saveUsersTowns" &&
    isset($_POST["TownOne"]) &&
    isset($_POST["TownTwo"]) &&
    isset($_POST["TownThree"]) &&
    isset($_POST["TownFour"]) &&
    isset($_POST["TownFive"]) &&
    isset($_POST["userID"])){
    $db = new DOA_dbMaster();
    $townArr = [$_POST["TownOne"],
    $_POST["TownTwo"],
    $_POST["TownThree"],
    $_POST["TownFour"],
    $_POST["TownFive"]];

    for($i = 0 ; $i < count($townArr); $i++){
        //if(trim($townArr[$i]) !== ""){
            if(!($db->isRowUsedInUserDB($i,$_POST["userID"]))){
                $db->addUsersTown(trim($townArr[$i]) ,$_POST["userID"], $i);
            }else{
                $db->editUsersTown(trim($townArr[$i]),$_POST["userID"],$i);
            }
        //}
    }


    echo json_encode($usersTowns, JSON_UNESCAPED_SLASHES);
}

if($_GET["function"] == "getUsersTowns" && isset($_GET["userID"])){
    $db = new DOA_dbMaster();

    $usersTowns = $db->getUsersTowns($_GET["userID"]);


    echo json_encode($usersTowns, JSON_UNESCAPED_SLASHES);
}

if($_POST["function"] == "getArtistEventDataFromCalenderURL" && isset($_POST["artistCalenderURL"])){

    $AristsConcertResults = getArtistCalenderFromArtistCalenderURL($_POST["artistCalenderURL"]);

    if(count($AristsConcertResults["resultsPage"]["results"]) !== 0){
        $AristsConcertResults = $AristsConcertResults["resultsPage"]["results"]["event"];
    }else{
        $AristsConcertResults = "no Events Planned";
    }



    echo json_encode($AristsConcertResults, JSON_UNESCAPED_SLASHES);
}

if($_POST["function"] == "searchArtists" && isset($_POST["searchTerm"]) && isset($_POST["metroArr"])){

    $AristsResults = searchArtistOnSonkick($_POST["searchTerm"]);
    $AristsResults = $AristsResults["resultsPage"]["results"]["artist"];

    echo json_encode($AristsResults, JSON_UNESCAPED_SLASHES);
}

if($_POST["function"] == "searchCity" && isset($_POST["searchTerm"]) && isset($_POST["metroArr"])){
    $db = new DOA_dbMaster();
    $locationDataFromDB = $db->searchCityInDB($_POST["searchTerm"]);

    $todaysDate = new DateTime($todaysDate);
    $timeStampToday = $todaysDate->getTimestamp();
    $_SESSION["LatestCheckedLocationName"] = $_POST["searchTerm"];
    $dbDate = new DateTime($locationDataFromDB["BestBefore"]);
    $timeStampFromDB = $dbDate->getTimestamp();

    //Kollar om datan i databasen är äldre än idag, om den är det ska ny data hämtas... annars används datan från databasen
    if($timeStampFromDB < $timeStampToday || $locationDataFromDB == null){
        //Annars hämtar vi data för detta ställe med vårt metroID
        $locationData = getSongkickLocationByName($_POST["searchTerm"]); // haha "getSonKick <- kick Son xD ;)
        $db = new DOA_dbMaster();
        $_SESSION["LatestCheckedLocationName"] = $locationData["resultsPage"]["results"]["location"][0]["city"]["displayName"];
        $metroId = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["id"];
        $metroAreaLat = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];
        $metroAreaLng = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];
        $metroAreaName = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["displayName"];

        $LocationStatus = $db->checkIfLocationNeedsUpdate($metroId);

        getEventFromLocation($db,$LocationStatus,$metroId,$metroAreaLat,$metroAreaLng,$metroAreaName);
    }else{
        echo $locationDataFromDB["LocationJSON"];
    }

}

if($_GET["function"] == "isUserOnline"){

    if(isset($_SESSION["OnlineUser"]) && $_SESSION["OnlineUser"] !== null){
        echo ($_SESSION["OnlineUser"]);
    }else{
        echo "false";
    }
}

if($_GET["function"] == "checkStatusOnApi"){
    $ArrayWithStatusAndData = [];
    $songkickStatus = getSongkickApiStatus();
    if($songkickStatus["resultsPage"]["status"] !== "ok"){
        $ArrayWithStatusAndData["songKickStatus"] = "fail";
    }else{
        $ArrayWithStatusAndData["songKickStatus"] = "ok";
    }

     $spotifyStatus = getSpotifyApiStatus();

    if($spotifyStatus["id"] !== "grayfish"){
        $ArrayWithStatusAndData["spotifyStatus"] = "fail";
    }else{
        $ArrayWithStatusAndData["spotifyStatus"] = "ok";
    }
    echo json_encode($ArrayWithStatusAndData, JSON_UNESCAPED_SLASHES);

}

if($_GET["function"] == "getLocationsFromCache" &&
    isset($_GET["top"]) &&
    isset($_GET["bottom"]) &&
    isset($_GET["left"]) &&
    isset($_GET["right"])){

    $db = new DOA_dbMaster();

    $ConcertsFromDB = $db->getLocationsConcerts();
    $arrayToReturn = [];


    for($i=0; $i<count($ConcertsFromDB); $i++){

        if((float)$ConcertsFromDB[$i]["latitude"]  <  (float)$_GET["top"]    && (float)$ConcertsFromDB[$i]["longitude"] <  (float)$_GET["right"]
            &&
            (float)$ConcertsFromDB[$i]["latitude"] >  (float)$_GET["bottom"] && (float)$ConcertsFromDB[$i]["longitude"] >  (float)$_GET["left"]){

            array_push($arrayToReturn,$ConcertsFromDB[$i]);

        }
    }

    //$ArrayWithStatusAndData["data"] = $ConcertsFromDB;
    echo json_encode($arrayToReturn, JSON_UNESCAPED_SLASHES);

    //echo json_encode($arrayToReturn, JSON_UNESCAPED_SLASHES);

    //echo json_encode($arrayToReturn, JSON_UNESCAPED_SLASHES); //$ArrayWithStatusAndData
}else{
    //echo "ass"; <-- Test, detta fungerade. Dock så ska det inte fungera...  det är som att IF-satsen bråkar

}

if($_GET["function"] == "getLastCheckedLocationName"){
    echo $_SESSION["LatestCheckedLocationName"];
}
function getSpotifyApiStatus(){
    $url = "https://api.spotify.com/v1/users/grayfish";


    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;
}
function getSongkickApiStatus(){

    $url = "http://api.songkick.com/api/3.0/search/locations.json?query=null&apikey=O2uaF4oPnY6ujGCJ";


    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;
}

//Bättra namn hade vart getConcertsForLocation... hehe <- eller? jag minns inte xD
if($_POST["function"] == "getLocationForConcerts" && isset($_POST["longtidue"]) && isset($_POST["latitude"])){
    $locationData = getSonkickLocationByLngNLat($_POST["longtidue"],$_POST["latitude"]); // haha "getSonKick <- kick Son xD ;)
    $db = new DOA_dbMaster();
    $_SESSION["LatestCheckedLocationName"] = $locationData["resultsPage"]["results"]["location"][0]["city"]["displayName"];
    $metroId = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["id"];
    $metroAreaLat = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];
    $metroAreaLng = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];
    $metroAreaName = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["displayName"];

    $LocationStatus = $db->checkIfLocationNeedsUpdate($metroId);

    getEventFromLocation($db,$LocationStatus,$metroId,$metroAreaLat,$metroAreaLng,$metroAreaName);

}

function getEventFromLocation($db,$LocationStatus,$metroId,$metroAreaLat,$metroAreaLng,$metroAreaName){
    if($LocationStatus === true || $LocationStatus === "new"){

        // Vi går in i if-satsen om
        // $LocationStatus == TRUE  : Platsen fanns och ska UPPDATERAS
        // $LocationStatus == "new"  : Platsen fanns inte innan och ska LÄGGAS till

        if(in_array($metroId, json_decode($_POST["metroArr"])) == false && $metroId != NULL ){ // denna är lite gammal, den kanske hjälper mot något fortfarande.. typ om något blir null(?)
            //För att undvika onödiga request.. Är metroID null så finns inget metro = onödig request... om den redan finns på klienten = onödig request.

            $songkickConcertOnSpecificArea = getSongkickEventsBySongkickLocation($metroId);

            $eventArray = [];
            $eventArray = getEventArrayFromMetroID($metroId);

            //$eventsInArea = $songkickConcertOnSpecificArea["resultsPage"]["results"]["event"];
            array_push($eventArray,$metroId); //sista i arrayen är metroID....

            $eventJSON = json_encode($eventArray, JSON_UNESCAPED_SLASHES);


            //Här bästmmer jag om jag uppdaterar eller lägger till ny.
            if($LocationStatus === "new"){

                $db->addLocationDataToDB($metroId ,$eventJSON, $metroAreaLat, $metroAreaLng,$metroAreaName);
            }elseif($LocationStatus === true){
                $db->updateLocationDataToDB($metroId ,$eventJSON);
            }

            echo $eventJSON;
        }
    }else{
        //echo "nope";
        //Eftersom pplikationen är ändrd här så ska vi istället se till att hämta ner datan på nytt...
        //Vi behöver tänka igenom det här men vi testar oss fram.. ändå! <- vi måste ju på något sätt
        //Inte hätma data varje gång.. liksom.. öhm.. ah.. hmm..

        $MetroIDArr = json_decode($_POST["metroArr"]);

        if(in_array($metroId, $MetroIDArr) == false){

            $LocationEventData = $db->getLocationsConcertsByMetroID($metroId);//Hämta från databas...

            echo $LocationEventData[0]["LocationJson"];//json_encode($LocationEventData["LocationJson"], JSON_UNESCAPED_SLASHES);
        }else{
            echo "nope";
        }

    }
}
function getArtistCalenderFromArtistCalenderURL($url){

    $url = $url . "?apikey=O2uaF4oPnY6ujGCJ";


    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);


    return $userResultDecoded;
}

function getEventArrayFromMetroID($metroId){
    $counter = 1;
    $eventArray = [];
    do{
        $songkickConcertOnSpecificArea = getSongkickEventsBySongkickLocation($metroId,$counter);
        $counter++;
        $toAdd = $songkickConcertOnSpecificArea["resultsPage"]["results"];


        if(count($toAdd) >= 1){
            for($j = 0; $j <count($toAdd["event"]); $j++ ){

                if($toAdd["event"][$j]["location"]["lng"] == null && $toAdd["event"][$j]["location"]["lat"] == null){
                    //Om positionen lng och lat är null så får vi hämta dem på nytt... (orsakade att, tex, inga konserter från köpenhamn kunde visas...)
                    $cityGeo = getSongkickLocationByName($toAdd["event"][$j]["location"]["city"]);
                    $toAdd["event"][$j]["location"]["lat"] = $cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];
                    $toAdd["event"][$j]["location"]["lng"] = $cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];

                    if($cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lat"] != null &&
                        $cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lng"] != null){
                        // Om inga kordinater hittas så ignoreras denna konsert.
                        array_push($eventArray, $toAdd["event"][$j]);
                    }
                }else{
                    //om inga problem, så läggs den till som vanligt
                    array_push($eventArray, $toAdd["event"][$j]);
                }
            }
        }
        if($counter == 10){
            //om $Counter har gått upp till 10, Då har vi hämtat 10 sidor med data
            //Det är ungefär konserter en månad frammåt.
            // För att Servern inte ska krascha så begränsar vi oss här, vi kör en break
            // Och Låter det vara den hämtade datan
            // Inget går ju förlorat då Data hämtas varrje dag (eller var 4 timme om trycks på, rättare sagt..)
            break;
        }
    }while(count($toAdd) != 0);
    return $eventArray;
}



function getSongkickLocationByName($name, $urlPage = 1){

    $url = "http://api.songkick.com/api/3.0/search/locations.json?query={$name}&apikey=O2uaF4oPnY6ujGCJ&page=".$urlPage;


    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;
}

function getSongkickEventsBySongkickLocation($metroLocationID,$page=1){
    $url = "http://api.songkick.com/api/3.0/metro_areas/{$metroLocationID}/calendar.json?apikey=O2uaF4oPnY6ujGCJ&page=".$page;

    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;
}
function getSonkickLocationByLngNLat($lng, $lat){

    $url = "http://api.songkick.com/api/3.0/search/locations.json?location=geo:{$lat},{$lng}&apikey=O2uaF4oPnY6ujGCJ";

    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;
}

if($_GET["function"] == "getArtistConcertData"){ // TILLFÄLLIGT DÖD!


    if(isset($_SESSION["ArtistList"])){
    // notis: först hämtade jag ut artister från spotify och hämtade konsertdata till
    //dessa problemet var att det tar cirka 4 min att hämta data från 700 artister... Så nu försöker jag lösa det på annat vis
        //Konsertdata ska nu istället hämtas från en plats, sen visas de artister man har på spotify med Tjockare text (eller annat..)


        $artistIDListFromSongKick = [];
        $artistConceretInfoListFromSonkick = [];
        for($i=0;$i<count($_SESSION["ArtistList"]);$i++){ //Loopen hämtar ut artisternas ID från Sonkick

            //$artistResult = searchArtistOnSonkick($_SESSION["ArtistList"][$i][0]);
            if($i == 100){
                var_dump($artistResult);
                die();
            }
            if($artistResult["resultsPage"]["status"] == "ok"){
                array_push($artistIDListFromSongKick, $artistResult["resultsPage"]["results"]["artist"][0]["id"]);
            }


        }



        for($i=0;$i<count($artistIDListFromSongKick); $i++){// Loopen hämtar ut artisternas Concertdata baserat på deras ID'n...
            ////////////////////////////$artistConcertResult = getArtistConcertDataFromArtistID($artistIDListFromSongKick[$i]);
            array_push($artistConceretInfoListFromSonkick, $artistConcertResult);
        }

        $_SESSION["ArtistsConcertList"] = $artistConceretInfoListFromSonkick;

    }
}

function getArtistConcertDataFromArtistID($ArtistID){
    $url = "http://api.songkick.com/api/3.0/artists/{$ArtistID}/calendar.json";
    $key = "?apikey=O2uaF4oPnY6ujGCJ";

    $cu = curl_init();
    $url .=  $key;

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;
}

function searchArtistOnSonkick($ArtistToCheck){
    $url = "http://api.songkick.com/api/3.0/search/artists.json";
    $key = "O2uaF4oPnY6ujGCJ";

    $cu = curl_init();
    /*$url = http_build_url($url,
                        array(
                        "query" => $ArtistToCheck,
                        "key" => $key
                        ));*/
    $url = "http://api.songkick.com/api/3.0/search/artists.json?query=".$ArtistToCheck."&apikey=". $key;
    $url = str_replace(" ","%20",$url);

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;
}

if($_GET["function"] == "getUsersArtists"){ //Artister på användarens listor blir hämtade och returnerade med Echo.. (för js-ajax)
    $allPlaylists = [];
    $custom = "";
    $db = new DOA_dbMaster();

    if($db->canUserUpdateArtistJSON($_SESSION["OnlineUser"])){
        do{
            $playlists = getUserPlaylist($custom);
            $custom = $playlists["next"];

            for($i = 0; $i < count($playlists["items"]); $i++){
                array_push($allPlaylists, $playlists["items"][$i]);
            }

        }while($playlists["next"] != null);


        $userID = $_SESSION["OnlineUser"];
        $ArtistList = [];
        $artistNameTempList = [];
        $artist;

        for($i = 0; $i < count($allPlaylists);$i++){
            if($allPlaylists[$i]["owner"]["id"] == $userID){
               $songsOnPlaylist = getUserSongsFromPlaylist($allPlaylists[$i]);

                for($j=0;$j< count($songsOnPlaylist["items"]); $j++){
                    $artist = $songsOnPlaylist["items"][$j]["track"]["artists"][0]["name"];

                    if(in_array($artist, $artistNameTempList) == false){//Om artisten ej finns, lägg till artisten
                        array_push($artistNameTempList, $artist);

                        $artistId = $songsOnPlaylist["items"][$j]["track"]["artists"][0]["id"];
                        $artistAndID = [$artist, $artistId];
                        array_push($ArtistList, $artistAndID); // lägger in Artisten och artistID't i arrayen...
                    }
                }
            }
        }

        $_SESSION["ArtistList"] = $ArtistList;
        $ArtistListJson = json_encode($ArtistList,JSON_UNESCAPED_SLASHES);

        if($ArtistListJson === "[]"){
        //Säkerhet, vill inte att användaren ska behöva vänta
        //om spotify inte lyckades hämta listorna.. HAR HÄNT!
            echo "nope";
            return ;
        }else{
            $db->addArtistJSONToUser($userID, $ArtistListJson);
        }
        echo $ArtistListJson;

    }else{
        echo json_encode($db->getUsersArtistJSON($_SESSION["OnlineUser"]),JSON_UNESCAPED_SLASHES);
    }

    //header("Location: index.html");
}
function getUserSongsFromPlaylist($playList){ //returnerar alla låstar från en playlist
    $userID = $_SESSION["OnlineUser"];

    $cu = curl_init();
    $url = "https://api.spotify.com/v1/users/".$userID."/playlists/".$playList["id"]."/tracks";

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu,CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$_SESSION["AccessData"]["access_token"]));
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    return $userResultDecoded;

}
function getUserPlaylist($custom = ""){ // hämtar ut 50 playlists åt gången
    $userID = $_SESSION["OnlineUser"];


    //Påbeörjar att hämta datan från användaren... $userResultDecoded är en Associativ Array som innehåller Användardata.
    if($custom != ""){
        $url = $custom;
    }else{
        $url = "https://api.spotify.com/v1/users/".$userID."/playlists?limit=50";
    }


    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu,CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$_SESSION["AccessData"]["access_token"]));
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

/*    if(isset($userResultDecoded["next"])){
        $AllPlaylists = $userResultDecoded;
        $AllPlaylists .= getUserPlaylist($userResultDecoded["next"]);
    }else{
        $AllPlaylists = $userResultDecoded;
    }*/

    return $userResultDecoded;

}



//Kod som inte kan användas pga begränsning. Koden är för krävande och datan blir för stor. Annan lösning ska implementeras...
/*if($_GET["function"] == "getLocationForConcertsOverCountry" && isset($_GET["longtidue"]) && isset($_GET["latitude"])){
    $locationData = getSonkickLocationByLngNLat($_GET["longtidue"],$_GET["latitude"]);

    $Country = $locationData["resultsPage"]["results"]["location"][0]["city"]["country"]["displayName"];
    $counter = 1;
    $arryOfLocationsMetroID = [];
    do{
        $SongKickEventsOverCountry = getSongkickLocationByName($Country,$counter);
        $counter++;
        $toAdd = $SongKickEventsOverCountry["resultsPage"]["results"];

        if(count($toAdd) >= 1){
            for($i = 0; $i <count($toAdd["location"]); $i++ ){
                array_push($arryOfLocationsMetroID, $toAdd["location"][$i]["metroArea"]["id"]);


            }
        }

    }while(count($toAdd) != 0); // När ToAdd inte har några resultat så är den 0. så håll på tills den blir 0...

    $arrOfLocations = [];
    //$timeStart = microtime(true);
    //$resultsss = microtime(true) - $timeStart; ($resultsss/60 = svaret i minuter...)
    //Tar ungefär 1.2 minuter att hämta 300 Locations med MetroID...
    for($i=0; $i<count($arryOfLocationsMetroID);$i++ ){ // här hämtas datan för alla platsers konsärer  (från tex sverige)
        $counter = 1;
        do{
            $LocationsPerPage = getSongkickEventsBySongkickLocation($arryOfLocationsMetroID[$i],$counter);
            $toAdd = $LocationsPerPage["resultsPage"]["results"];
            $counter++;

            if(count($toAdd) >= 1){
                for($j = 0; $j <count($toAdd["event"]); $j++ ){
                    array_push($arrOfLocations, $toAdd["event"][$j]);
                }
            }
            if($i == 3){
                var_dump($arrOfLocations);
                die();
            }

        }while(count($toAdd) != 0);
    }

    var_dump($arrOfLocations);
    die();


}*/


// LONG BACKUP

/*
if($_POST["function"] == "getLocationForConcerts" && isset($_POST["longtidue"]) && isset($_POST["latitude"])){
    $locationData = getSonkickLocationByLngNLat($_POST["longtidue"],$_POST["latitude"]); // haha "getSonKick <- kick Son xD ;)
    $db = new DOA_dbMaster();
    $_SESSION["LatestCheckedLocationName"] = $locationData["resultsPage"]["results"]["location"][0]["city"]["displayName"];
    $metroId = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["id"];
    $metroAreaLat = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];
    $metroAreaLng = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];
    $metroAreaName = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["displayName"];

    $LocationStatus = $db->checkIfLocationNeedsUpdate($metroId);

    if($LocationStatus === true || $LocationStatus === "new"){

        // Vi går in i if-satsen om
        // $LocationStatus == TRUE  : Platsen fanns och ska UPPDATERAS
        // $LocationStatus == "new"  : Platsen fanns inte innan och ska LÄGGAS till

        if(in_array($metroId, json_decode($_POST["metroArr"])) == false && $metroId != NULL ){ // denna är lite gammal, den kanske hjälper mot något fortfarande.. typ om något blir null(?)
            //För att undvika onödiga request.. Är metroID null så finns inget metro = onödig request... om den redan finns på klienten = onödig request.

            $songkickConcertOnSpecificArea = getSongkickEventsBySongkickLocation($metroId);

            $eventArray = [];
            $counter = 1;
            do{
                $songkickConcertOnSpecificArea = getSongkickEventsBySongkickLocation($metroId,$counter);
                $counter++;
                $toAdd = $songkickConcertOnSpecificArea["resultsPage"]["results"];


                if(count($toAdd) >= 1){
                    for($j = 0; $j <count($toAdd["event"]); $j++ ){

                        if($toAdd["event"][$j]["location"]["lng"] == null && $toAdd["event"][$j]["location"]["lat"] == null){
                            //Om positionen lng och lat är null så får vi hämta dem på nytt... (orsakade att, tex, inga konserter från köpenhamn kunde visas...)
                            $cityGeo = getSongkickLocationByName($toAdd["event"][$j]["location"]["city"]);
                            $toAdd["event"][$j]["location"]["lat"] = $cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];
                            $toAdd["event"][$j]["location"]["lng"] = $cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];

                            if($cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lat"] != null &&
                                $cityGeo["resultsPage"]["results"]["location"][0]["metroArea"]["lng"] != null){
                                // Om inga kordinater hittas så ignoreras denna konsert.
                                array_push($eventArray, $toAdd["event"][$j]);
                            }
                        }else{
                            //om inga problem, så läggs den till som vanligt
                            array_push($eventArray, $toAdd["event"][$j]);
                        }
                    }
                }
                if($counter == 10){
                    //om $Counter har gått upp till 10, Då har vi hämtat 10 sidor med data
                    //Det är ungefär konserter en månad frammåt.
                    // För att Servern inte ska krascha så begränsar vi oss här, vi kör en break
                    // Och Låter det vara den hämtade datan
                    // Inget går ju förlorat då Data hämtas varrje dag (eller var 4 timme om trycks på, rättare sagt..)
                    break;
                }
            }while(count($toAdd) != 0);

            //$eventsInArea = $songkickConcertOnSpecificArea["resultsPage"]["results"]["event"];
            array_push($eventArray,$metroId); //sista i arrayen är metroID....

            $eventJSON = json_encode($eventArray, JSON_UNESCAPED_SLASHES);


            //Här bästmmer jag om jag uppdaterar eller lägger till ny.
            if($LocationStatus === "new"){

                $db->addLocationDataToDB($metroId ,$eventJSON, $metroAreaLat, $metroAreaLng,$metroAreaName);
            }elseif($LocationStatus === true){
                $db->updateLocationDataToDB($metroId ,$eventJSON);
            }

            echo $eventJSON;
        }
    }else{
        //echo "nope";
        //Eftersom pplikationen är ändrd här så ska vi istället se till att hämta ner datan på nytt...
        //Vi behöver tänka igenom det här men vi testar oss fram.. ändå! <- vi måste ju på något sätt
        //Inte hätma data varje gång.. liksom.. öhm.. ah.. hmm..

        $MetroIDArr = json_decode($_POST["metroArr"]);

        if(in_array($metroId, $MetroIDArr) == false){

            $LocationEventData = $db->getLocationsConcertsByMetroID($metroId);//Hämta från databas...

            echo $LocationEventData[0]["LocationJson"];//json_encode($LocationEventData["LocationJson"], JSON_UNESCAPED_SLASHES);
        }else{
            echo "nope";
        }

    }

}
*/