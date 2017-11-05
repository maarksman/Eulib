<!doctype html>
<html lang-"en">
<head>
	<meta charset="utf-8">
	<Title>Viewing Page</title>
	<link href="jsImgSlider/generic.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<!--knowl scripts-->
	<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"> </script>
	<link href="http://aimath.org/knowlstyle.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="knowl.js"></script>
	<!--Mathjax scripts-->
	<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
	</script>
	<script type="text/javascript" async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML">
	</script>
	<!--slider script-->
	<link href="jsImgSlider/themes/4/js-image-slider.css" rel="stylesheet" type="text/css" />
  <script src="jsImgSlider/themes/4/js-image-slider.js" type="text/javascript"></script>
</head>

<!-- This div is for PHP and other code needed -->
<div>
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
		// Do first query
		$querycontent = "select content from Article where artid='0'";
		$query = mysqli_query($conn, $querycontent);
		while ($row = mysqli_fetch_array($query)){
           $first_knowl = $row['content'];
				 }
		mysqli_close($conn);
	?>

</div>

<body>
	<div class="container">
		<header>
			<img src="images/Eulibbanner.png" alt="Loading....">
		</header>
		<?=$first_knowl?>

	</div>
</body>
</html>
