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
        <title>Login Results</title>
    </head>
    <body>

    




<?php
function confirmPass(){


    //retrieve variables.
    $usr = $_POST["usernamefield"];
    $pas = $_POST["passwordfield"];

    $server = mysql_connect("localhost","jfreeze","xBngNRS3");
    $db =  mysql_select_db("jfreeze",$server);
    $query = mysql_query("Select * from User where username = '$usr'");
    $row = mysql_fetch_array($query);
    $usrDB = $row['username'];
    $pasDB = $row['password'];
    $dateDB = $row['salt'];
    $one = '=';
    $two = "==";

    //$pad=strlen('$pasDB')%4;
    //echo $pad;
    //if($pad==1){
    //  $pasDB = $pasDB.$one;
    //}elseif($pad > 1){
    //  $pasDB = $pasDB.$two;
    //}


    //encode user given password+salt
    $givenpas = $dateDB.$pas;
    //echo $givenpas;
    $spgiven = gzdeflate($givenpas);
    //echo $spgiven;


    //compare DB pas and givenpas.
    //echo $spgiven;
    //echo "   ";
    //echo $pasDB;
    if(strcmp($spgiven,$pasDB)==0){

		//set cookie, expiration after a month.
      $cookie_name = "username";
      $cookie_value = $usr;
      setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
		  echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=mainscreen.php">';
		  echo '<h1 id="Login-header">';
        echo            'Successful Login!';
        echo '</h1>';
    	
	}else{
		echo '<META HTTP-EQUIV=refresh CONTENT="3;URL=Login.html">';
		echo '<h1 id="notEqual-header">';
        echo            'Please verify the account exists and that the password you entered is correct.';
        echo       '</h1>';
        //echo $spgiven;
        //echo $pasDB;
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