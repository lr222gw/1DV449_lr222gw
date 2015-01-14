<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-08
 * Time: 23:15
 */

session_start();


if($_GET["function"] == "isUserOnline"){
    if(isset($_SESSION["OnlineUser"])){
        echo ($_SESSION["OnlineUser"]);
    }else{
        echo false;
    }
}



if($_GET["function"] == "getLocationForConcerts" && isset($_GET["longtidue"]) && isset($_GET["latitude"])){
    $locationData = getSonkickLocationByLngNLat($_GET["longtidue"],$_GET["latitude"]);

    $metroId = $locationData["resultsPage"]["results"]["location"][0]["metroArea"]["id"];

    if(in_array($metroId, json_decode($_GET["metroArr"])) == false && $metroId != NULL ){
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
        }while(count($toAdd) != 0);

        //$eventsInArea = $songkickConcertOnSpecificArea["resultsPage"]["results"]["event"];
        array_push($eventArray,$metroId); //sista i arrayen är metroID....
        echo json_encode($eventArray, JSON_UNESCAPED_SLASHES);
    }
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
            $artistConcertResult = getArtistConcertDataFromArtistID($artistIDListFromSongKick[$i]);
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
    echo json_encode($ArtistList,JSON_UNESCAPED_SLASHES);
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