<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-15
 * Time: 00:35
 */
//session_start();
class DOA_dbMaster{
    private static $pdoString = 'mysql:host=konsertkartan-199508.mysql.binero.se;dbname=199508-konsertkartan;';
    private static $pdoUserName = '199508_yk43421';
    private static $pdoUserPass = 'NintendoPrincess1337';

    public function __construct(){

    }

    public function editUsersTown($townName, $userID, $row)
    {
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            UPDATE usersTowns
            set TownName = ?
            Where UserID = ? AND row = ?

            ";
            $param = [$townName,$userID, $row];
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute($param)){
            }


        }catch (PDOException $e){
            throw new \Exception("Sorry Could look for users towns in Database..." . $e->getMessage());
        }
    }

    public function checkDbStatus(){
         try{
             $dbh = new PDO( self::$pdoString, self::$pdoUserName, self::$pdoUserPass,
                             array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
             //die(json_encode(array('outcome' => true)));
             return "ok";
         }
         catch(PDOException $ex){
             //die(json_encode(array('outcome' => false, 'message' => 'Unable to connect')));
             return "bad";
         }

    }

    public function addUsersTown($townName, $userID, $rowNumber)
    {
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            INSERT INTO usersTowns (TownName, UserID, row)
            Values (?,?, ?)
            ";
            $param = [$townName,$userID, $rowNumber];
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute($param)){
            }



        }catch (PDOException $e){
            throw new \Exception("Sorry could not add towns in Database..." . $e->getMessage());
        }
    }
    public function isRowUsedInUserDB($row,$userID)
    {
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT row
            FROM usersTowns
            WHERE UserID = ? AND row = ?
            ";
            $param = [$userID, (string)$row];
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute($param)){
                $result = $stmt->fetchColumn(0);
            }


            if($result === false){
                return false;
            }else{ return true;}

        }catch (PDOException $e){
            throw new \Exception("Sorry Could look for users towns in Database..." . $e->getMessage());
        }
    }


    public function getUsersTowns($userID)
    {
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT TownName
            FROM usersTowns
            WHERE UserID = ?
            ";
            $param = [$userID];
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute($param)){
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            return $result;

        }catch (PDOException $e){
            throw new \Exception("Sorry Could look for users towns in Database..." . $e->getMessage());
        }
    }

    public function searchCityInDB($searchTerm)
    {
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT MetroID, BestBefore,LocationJSON
            FROM Location
            WHERE LocationName LIKE ?
            ";
            $param = [$searchTerm];
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute($param)){
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            return $result;

        }catch (PDOException $e){
            throw new \Exception("Sorry Could search for City in Database..." . $e->getMessage());
        }
    }

    public function getLocationsConcerts(){
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT LocationJson,latitude,longitude
            FROM Location
            WHERE BestBefore > NOW()
            ";
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute()){
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            return $result;

        }catch (PDOException $e){
            throw new \Exception("Sorry Could check if your'e in Database..." . $e->getMessage());
        }
    }

    public function getLocationsConcertsByMetroID($metroID){
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT LocationJson
            FROM Location
            WHERE  MetroID = ?
            "; // BestBefore > NOW() AND
            $param = [$metroID];
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute($param)){
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            return $result;

        }catch (PDOException $e){
            throw new \Exception("Sorry Could check if your'e in Database..." . $e->getMessage());
        }
    }

    public function checkIfUserIsInDB($userId){
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT UserID
            FROM Users
            WHERE UserID = ?
            ";
            $paramArr = [$userId];

            $stmt = $databaseHandler->prepare($query);
            $stmt->execute($paramArr);
            if($stmt->execute($paramArr)){
                $result = $stmt->fetchColumn(0);
            }

            if($result == false){
                return false;
            }else{ return true;}

        }catch (PDOException $e){
            throw new \Exception("Sorry Could check if your'e in Database..." . $e->getMessage());
        }

    }

    public function getUsersArtistJSON($userId){
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT UserArtists
            FROM Users
            WHERE UserID = ?
            ";
            $paramArr = [$userId];

            $stmt = $databaseHandler->prepare($query);
            $stmt->execute($paramArr);
            if($stmt->execute($paramArr)){
                $result = $stmt->fetchColumn(0);
            }

            return $result;

        }catch (PDOException $e){
            throw new \Exception("Sorry Could not get users Artists from Database..." . $e->getMessage());
        }

    }

    public function updateLocationDataToDB($metroID, $locationJSON)
    {
        try{//För säkerhet
            $databasHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databasHandler->beginTransaction();
            $databasHandler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $queryString = "
            UPDATE Location
            SET LocationJSON = ?, BestBefore = ?
            where  MetroID = ?";


            $todaysDate = date("Y-m-d H:i:s");

            if(count(json_decode($locationJSON)) === 1){
                $dateForAvailbeUpdate = date("Y-m-d H:i:s", strtotime($todaysDate . " - 1 hours"));
            }else{
                $dateForAvailbeUpdate = date("Y-m-d H:i:s", strtotime($todaysDate . " + 4 hours"));
                // ^ " + 4 hours" berättar hur många timmar datan ska anävndas från Cachen!
            }

            $paramArr = [$locationJSON, $dateForAvailbeUpdate, $metroID];

            $stmt = $databasHandler->prepare($queryString);
            $result = $stmt->execute($paramArr);

            $databasHandler->commit();

        }catch (PDOException $e){
            $databasHandler->rollBack();
            throw new \Exception("Could Not Update LocationData in Database..." . $e->getMessage());
            die();
        }
    }

    public function addLocationDataToDB($metroID, $locationJSON, $lat, $lng, $locationName){
        try{//För säkerhet
            $databasHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databasHandler->beginTransaction(); // Ifall någåt fel händer vill vi backa..
            $databasHandler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // för error Reporting..

            //Föörbereder queryn, vad som ska göras. lägg till användare med dess "intresserade artister"
            $queryString = "
            Insert INTO Location (MetroID, LocationJSON, BestBefore, latitude, longitude, LocationName)
            Values (?,?,?, ?, ?,?)";

            $todaysDate = date("Y-m-d H:i:s");


            //Denna if-sats är till för att ändra tiden man får kolla om ny data kommit till ett ställe
            //Som inte har några konserter alls. Detta för att jag vill kunna berätta för en användare
            //att det inte finns någon data där.
            //Sen är det bra då det hela tiden låter användare kolla om det kommit in något nytt, utan att
            //Behöva vänta 4 timmar.
            if(count(json_decode($locationJSON)) === 1){
                $dateForAvailbeUpdate = date("Y-m-d H:i:s", strtotime($todaysDate . " - 1 hours"));
            }else{
                $dateForAvailbeUpdate = date("Y-m-d H:i:s", strtotime($todaysDate . " + 4 hours"));
                // ^ " + 4 hours" berättar hur många timmar datan ska anävndas från Cachen!
            }


            $paramArr = [$metroID, $locationJSON, $dateForAvailbeUpdate, $lat, $lng, $locationName];

            $stmt = $databasHandler->prepare($queryString);
            $result = $stmt->execute($paramArr);

            $databasHandler->commit();


        }catch (PDOException $e){
            $databasHandler->rollBack();
            throw new \Exception("Could Not add LocationData to Database..." . $e->getMessage());
            die();
        }
    }

    public function checkIfLocationNeedsUpdate($metroID){
        try{//För säkerhet
            $databasHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databasHandler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // för error Reporting..

            //Föörbereder queryn, vad som ska göras. lägg till användare med dess "intresserade artister"
            $queryString = "
            SELECT BestBefore
            from Location
            where  MetroID = ?";

            $paramArr = [$metroID];

            $stmt = $databasHandler->prepare($queryString);

            if($stmt->execute($paramArr)){
                $date = $stmt->fetchColumn(0);
                $dateFromDatabase = new DateTime($date);
                $dateNow = new DateTime();

                if($date == null){
                    //Om date == null så har LocationData ej hämtats för platsen!
                    // Då hämtas ny data och platsen kan LÄGGAS in på databasen.
                    // Om platsen är tillagd så kan vi UPPDATERA den i databasen.
                    return "new";
                }

                if($dateFromDatabase < $dateNow){
                    return true;
                }else{
                    return false;
                }
            }


        }catch (PDOException $e){
            $databasHandler->rollBack();
            throw new \Exception("Could not Check if needed to update LocationData..." . $e->getMessage());
            die();
        }
    }

    public function canUserUpdateArtistJSON($userId){
        try{//För säkerhet
            $databasHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databasHandler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // för error Reporting..

            //Föörbereder queryn, vad som ska göras. lägg till användare med dess "intresserade artister"
            $queryString = "
            SELECT UserArtistsBestBefore
            from Users
            where  UserID = ?";

            $paramArr = [$userId];

            $stmt = $databasHandler->prepare($queryString);

            if($stmt->execute($paramArr)){
                $date = $stmt->fetchColumn(0);
                $dateFromDatabase = new DateTime($date);
                $dateNow = new DateTime();

                if($dateFromDatabase < $dateNow || $date == null){
                    //Om date == null så har användaren ej hämtat spotify data!
                    return true;
                }else{
                    return false;
                }
            }


        }catch (PDOException $e){
            $databasHandler->rollBack();
            throw new \Exception("Could not Check if able to updateArtistList..." . $e->getMessage());
            die();
        }
    }

    public function addArtistJSONToUser($userId, $userArtistsJSON){
        try{//För säkerhet
            $databasHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databasHandler->beginTransaction(); // Ifall någåt fel händer vill vi backa..
            $databasHandler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // för error Reporting..

            //Föörbereder queryn, vad som ska göras. lägg till användare med dess "intresserade artister"
            $queryString = "
            UPDATE Users
            SET UserArtists = ?, UserArtistsBestBefore = ?
            where  UserID = ?";
            $todaysDate = date("Y-m-d H:i:s");
            $dateForAvailbeUpdate = date("Y-m-d H:i:s", strtotime($todaysDate . " + 1 hours"));
            // ^ " + 1 hours" berättar hur många timmar datan ska anävndas från Cachen!

            $paramArr = [$userArtistsJSON, $dateForAvailbeUpdate, $userId];

            $stmt = $databasHandler->prepare($queryString);
            $result = $stmt->execute($paramArr);

            $databasHandler->commit();

        }catch (PDOException $e){
            $databasHandler->rollBack();
            throw new \Exception("Sorry Could not add your artists to Database..." . $e->getMessage());
            die();
        }
    }

    public function addUser($userId, $userDisplayName, $userMail){
        try{//För säkerhet
            $databasHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databasHandler->beginTransaction(); // Ifall någåt fel händer vill vi backa..
            $databasHandler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // för error Reporting..

            //Föörbereder queryn, vad som ska göras. lägg till användare med dess "intresserade artister"
            $queryString = "
            INSERT INTO Users(userID,DisplayName,Email)
            values(?,?,?)";
            $paramArr = [$userId, $userDisplayName, $userMail];

            $stmt = $databasHandler->prepare($queryString);
            $result = $stmt->execute($paramArr);

            $databasHandler->commit();

        }catch (PDOException $e){
            $databasHandler->rollBack();
            throw new \Exception("Sorry Could not add you to Database..." . $e->getMessage());
            die();
        }
    }



}


/*
/*    public function getLocationsMetroIDs(){
        try{
            $databaseHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databaseHandler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            $query= "
            SELECT MetroID
            FROM Location
            WHERE BestBefore > NOW()
            ";
            $stmt = $databaseHandler->prepare($query);

            if($stmt->execute()){
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            return $result;

        }catch (PDOException $e){
            throw new \Exception("Sorry Could check if your'e in Database..." . $e->getMessage());
        }
    }*/


