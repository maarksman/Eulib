<!doctype html>
<html lang-"en">
<head>
	<meta charset="utf-8">
	<Title>Compactness(Topology) - Theorem 27</title>
		<link rel="stylesheet" type="text/css" href="css/styles.css">
		<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"> </script>
	<link href="http://aimath.org/knowlstyle.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="http://aimath.org/knowl.js"></script>
	<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML">
</script>
</head>


<?php
$servername = "localhost";
$username = "euclevgp_mauden";
$password = "p@ssw0rd";
$db_name = "euclevgp_testdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
// echo "Connected successfully";

// Do a query
$querycontent = "select Content from Article where ArtID='0'";
$query = mysqli_query($conn, $querycontent);
  while ($row = mysqli_fetch_array($query)){       		
           echo $row['Content'];          
  }
  
 echo <p>"am I here</p>
    ?>
</body>
</html>