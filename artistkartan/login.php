<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-11
 * Time: 18:47
 */
use \SpotifyWebAPI;

$curl = curl_init();
$myClientIDForSpotify = "32d69ac656814a37bc890e0840076720";
$myRedirect = "http://konsertkartan.com/index.html";
$spotifyUrlLogin = "http://accounts.spotify.com/authorize/
                    ?client_id=".$myClientIDForSpotify."
                    &response_type=code
                    &redirect_uri=".$myRedirect."
                    &scope=user-read-private%20user-read-email
                    &state=34fFs29kd09";
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_URL, "https://accounts.spotify.com/authorize/?client_id=32d69ac656814a37bc890e0840076720&response_type=code&redirect_uri=http://konsertkartan.com/getLogin.php&scope=user-read-private%20user-read-email&state=34fFs29kd09");
curl_setopt($curl, CURLOPT_USERAGENT, "Lowe Raivio: lr222gw@student.lnu.se");


curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_URL, "https://accounts.spotify.com/authorize/?client_id=32d69ac656814a37bc890e0840076720&response_type=code&redirect_uri=http://konsertkartan.com/getLogin.php&scope=user-read-private%20user-read-email&state=34fFs29kd09");
curl_setopt($curl, CURLOPT_REFERER, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);


$data = curl_exec($curl);

curl_close($curl);


$hej = file_get_contents("http://accounts.spotify.com/authorize/?client_id=32d69ac656814a37bc890e0840076720&response_type=code&redirect_uri=http://konsertkartan.com/getLogin.php&scope=user-read-private%20user-read-email&state=34fFs29kd09");





echo $data;

