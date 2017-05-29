<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script>
        <style type="text/css">
            tr.header
  {
    font-weight:bold;
  }
            tr.alt
            {
	      background-color: #777777;
            }
        </style>
        <script type="text/javascript">
	      $(document).ready(function(){
		  $('.striped tr:even').addClass('alt');
		});
        </script>
        <title>Sign-Up Results</title>
    </head>
    <body>

    




<?php
function confirmPass(){
	$usr = $_POST["usernamefield"];
	$server = mysql_connect("localhost","jfreeze","xBngNRS3");
	$db =  mysql_select_db("jfreeze",$server);
	$query = mysql_query("Select username from User where username = '$usr'");
	$usrcheck = mysql_fetch_array($query);
	$usrchk = $usrcheck['username'];

	if(strcmp($usr,$usrcheck)!=0){
	 if(strcmp($_POST["passwordfield"],$_POST["confirmfield"])==0){
		if($_POST["educationfield"]>=1 && $_POST["educationfield"]<=4){
		$salt = date("Y.m.d.h:i:sa");
		$date = date("Y.m.d");

		//echo $salt;
		$saltedpass = $salt.$_POST["passwordfield"];
		//echo $saltedpass;
		$sp = gzdeflate($saltedpass);
		//echo $sp;
		$frst = $_POST["firstfield"];
		$lst = $_POST["lastfield"];
    $fld1 = $_POST["educationfield"];
    $genre = "Unspecified";

		$server = mysql_connect("localhost","jfreeze","xBngNRS3");
		$db =  mysql_select_db("jfreeze",$server);
		$query = mysql_query("Insert into User Values('$usr','$sp','$date',0,'$frst','$lst','$salt')");
    $query2 = mysql_query("Insert into Has_Experience Values('$usr','$genre','$fld1')");

      $cookie_name = "username";
      $cookie_value = $usr;
      setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
		echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=mainscreen.php">';
		echo '<h1 id="Signup-header">';
        echo            'Your account has been created!';
        echo '</h1>';
    	}else {
    		echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=Signup.html">\n';
		echo '<h1 id="Signup-header">';
        echo            'Please select an education level between 1-4.';
        echo '</h1>';
    	}
	}else{
		echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=Signup.html">';
		echo '<h1 id="notEqual-header">';
        echo            'Your passwords do not match!';
        echo       '</h1>';
	}
 }else{
	echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=Signup.html">';
		echo '<h1 id="notEqual-header">';
        echo            'This user already exists.';
        echo       '</h1>';
 }
}

confirmPass();

?>


<!--<table class="striped">
    <tr class="header">
        <td>username</td>
        <td>password</td>
        <td>registration_date</td>
        <td>num_art_edited</td>
        <td>first_name</td>
        <td>last_name</td>
        <td>salt</td>
    </tr>
   // <?php
		//$usr = $_POST["usernamefield"];
    	//$server = mysql_connect("localhost","jfreeze","xBngNRS3");
		//$db =  mysql_select_db("jfreeze",$server);
		//$query1 = mysql_query("Select * from User where username = '$usr'");
  //while ($row = mysql_fetch_array($query1)){

   // echo "<tr>";
   // echo "<td>".$row['username']."</td>";
   // echo "<td>".$row['password']."</td>";
   // echo "<td>".$row['registration_date']."</td>";
   // echo "<td>".$row['num_art_edited']."</td>";
   // echo "<td>".$row['first_name']."</td>";
   // echo "<td>".$row['last_name']."</td>";
   // echo "<td>".$row['salt']."</td>";
   // echo "<tr>";
  //}
   // ?>
</table>-->


</body>
</html>