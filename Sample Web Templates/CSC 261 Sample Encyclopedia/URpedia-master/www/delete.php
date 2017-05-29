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
        <title>Account Deleted</title>
    </head>
    <body>

    




<?php
function confirmPass(){


    //retrieve variables.
    $cook = $_COOKIE["username"];

    $server = mysql_connect("localhost","jfreeze","xBngNRS3");
    $db =  mysql_select_db("jfreeze",$server);
    $query = mysql_query("Delete from User where username = '$cook'");
    echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=Signup.html">';
    echo '<h1 id="Delete-header">';
    echo            'Account '.$cook.' Deleted';
    echo '</h1>';
}


confirmPass();

?>

</body>
</html>