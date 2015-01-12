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