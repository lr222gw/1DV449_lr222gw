<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-11
 * Time: 19:24
 */
    require_once("dbstuff.php");
    session_start();



    $grant_type = "authorization_code";
    $code = $_GET["code"];
    $redirect_uri = "http://konsertkartan.com/getLogin.php";
    //$redirect_uri = "http://konsertkartan.com/getAccess.php";
    $client_id = "32d69ac656814a37bc890e0840076720";
    $client_secret = "495f479d5c904bb687365124cda62d7b";
    $postArr = array(
        "grant_type" => $grant_type,
        "code" => $code,
        "redirect_uri" => $redirect_uri,
        "client_id" =>$client_id,
        "client_secret" => $client_secret,
    );

    //Påbörjar att hämta accesstoken för en användares inloggning.
    $url = "https://accounts.spotify.com/api/token";
    foreach($postArr as $key=>$value){$postVars .= $key . "=" . $value . "&";}
    rtrim($postVars,"&");

    //$newURLToUse = $url . "?grant_type=" . $grant_type . "&code=". $code . "&redirect_uri=" . $redirect_uri . "&client_id=" . $client_id . "&client_secret=" . $client_secret;

    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    //curl_setopt($cu, CURLOPT_POST, count($postArr));
    curl_setopt($cu, CURLOPT_POSTFIELDS, $postVars);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $result = curl_exec($cu); //Datan från
    curl_close($cu);

    $accessData = json_decode($result,true);

    //Denna if-sats hjälper till. IBland när man loggar in så får man (utan anledning)
    //ett Error med texten invalid_grant, något har då gått fel och användaren loggas inte in
    //Det denna if-sats gör = gör ett nytt getanrop till spotify vilket som tar anvädnaren till
    //Denna PHP-sida där vi igen kollar så att accessData["error"] inte är invalid_grant
    //Sen sker en redirect och die för att ta anvädnaren till huvudsidan.
    if($accessData["error"] && $accessData["error"] === "invalid_grant" ){
        //var_dump([$accessData,$postVars]);
        /*header("Location: getLogin.php?code=".$_GET["code"]);
        die();*/

        $cu = curl_init();

        curl_setopt($cu, CURLOPT_URL, "https://accounts.spotify.com/authorize
        ?client_id=32d69ac656814a37bc890e0840076720
        &redirect_uri=http://konsertkartan.com/getLogin.php
        &response_type=code
        &scope=user-read-private user-read-email
        &state=34fFs29kd09
        &show_dialog=true");
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

        $result = curl_exec($cu); //Datan från
        curl_close($cu);
        header("Location: index.html?swag"); //OM SWAG BLIT PROBLEM SÅ ÄR DET HÄR SWAG FINNS! xD
        die();

    }


    //Påbeörjar att hämta datan från användaren... $userResultDecoded är en Associativ Array som innehåller Användardata.
    $url = "https://api.spotify.com/v1/me";
    $cu = curl_init();

    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu,CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$accessData["access_token"]));
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, TRUE); // ser till att resultatet kommer ner istället för om det lyckades eller ej

    $userResult = curl_exec($cu);
    $userResultDecoded = json_decode($userResult,true);
    curl_close($cu);

    $_SESSION["OnlineUser"] = $userResultDecoded["id"];
    $_SESSION["UserDisplayName"] = $userResultDecoded["display_name"];
    $_SESSION["UserEmail"] = $userResultDecoded["email"];
    $_SESSION["UserData"] = $userResultDecoded;
    $_SESSION["AccessData"] = $accessData;

    $db = new DOA_dbMaster();

    if($_SESSION["OnlineUser"] != null){ // om $_SESSION["OnlineUser"] är null så har användaren loggat ut..
        if($db->checkIfUserIsInDB($_SESSION["OnlineUser"]) == false){
            //Om användaren ej finns så ska den läggas till
            $db->addUser($_SESSION["OnlineUser"],$_SESSION["UserDisplayName"],$_SESSION["UserEmail"]);
        }else{
            //Om användaren hittas i databasen efter att blivit inlagd så kan man kontrollera det här...
            /*var_dump("Användare hittas");
            die();*/
        }
    }else{
        //Farväl meddelanden går att sätta här.. hehe
    }



    header("Location: index.html");
    die();



