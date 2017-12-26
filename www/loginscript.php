<?php

$servername = "localhost";
$username = "root";
$password = "mysql";
$db_name = "EulibDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected to DB! <br>";
// POST_["idhere"] gets data from HTML form

$username = $_POST["username"];
$password = $_POST["password"];

echo $username;
echo $password;


// Do first query, concatinate values to string
$querycontent = "SELECT username, password FROM User WHERE username = '".$username."'";

echo "Query was: ".$querycontent;

$query = mysqli_query($conn, $querycontent);

$founduser = false;

while ($row = mysqli_fetch_array($query)){
         $founduser = true;
         echo "username is: ".$row['username'];
         echo "password is: ".$row['password'];
}



mysqli_close($conn);

?>
