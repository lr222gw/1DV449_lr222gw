<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-15
 * Time: 00:35
 */

class DOA_dbMaster{
    private static $pdoString = 'mysql:host=konsertkartan-199508.mysql.binero.se;dbname=199508-konsertkartan;';
    private static $pdoUserName = '199508_yk43421';
    private static $pdoUserPass = 'NintendoPrincess1337';

    public function __construct(){

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

    public function addUser($userId){
        try{//För säkerhet
            $databasHandler = new PDO(self::$pdoString, self::$pdoUserName, self::$pdoUserPass);
            $databasHandler->beginTransaction(); // Ifall någåt fel händer vill vi backa..
            $databasHandler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // för error Reporting..

            //Föörbereder queryn, vad som ska göras. lägg till användare med dess "intresserade artister"
            $queryString = "
            INSERT INTO Users(userID)
            values(?)";
            $paramArr = [$userId];

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