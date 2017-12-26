<?php

$servername = "localhost";
$username = "root";
$password = "0227";
$db_name = "EulibDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected to DB! <br>";
// POST_["idhere"] gets data from HTML form

$title = $_POST["title"];
$belongs_to = $_POST["belongs_to"];
$type = $_POST["type"];
$content = $_POST["content"];
$id = (string) rand(1,1000001); // This is the number of seconds from a fixed datetime


// Do first query, concatinate values to string
$querycontent = "INSERT INTO Article (id, title, belongs_to, type, content) VALUES (";
$querycontent .= ( $id.", '" );
$querycontent .= ( $title."', '" );
$querycontent .= ( $belongs_to."', '" );
$querycontent .= ( $type."', '" );
$querycontent .= ( $content."')" );

echo "Query was: ".$querycontent;

$query = mysqli_query($conn, $querycontent);

mysqli_close($conn);

?>
