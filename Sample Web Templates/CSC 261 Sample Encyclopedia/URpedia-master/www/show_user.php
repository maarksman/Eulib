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
        <title></title>
    </head>
    <body>


<?php




$server = mysql_connect("localhost","jfreeze","xBngNRS3");
$db =  mysql_select_db("jfreeze",$server);
$query = mysql_query("select * from User");

?>

<table class="striped">
    <tr class="header">
        <td>username</td>
        <td>password</td>
        <td>registration_date</td>
        <td>num_art_edited</td>
        <td>first_name</td>
        <td>last_name</td>
        <td>salt</td>
    </tr>
    <?php
  while ($row = mysql_fetch_array($query)){

    echo "<tr>";
    echo "<td>".$row['username']."</td>";
    echo "<td>".$row['password']."</td>";
    echo "<td>".$row['registration_date']."</td>";
    echo "<td>".$row['num_art_edited']."</td>";
    echo "<td>".$row['first_name']."</td>";
    echo "<td>".$row['last_name']."</td>";
    echo "<td>".$row['salt']."</td>";
    echo "<tr>";
  }
    ?>
</table>
</body>
</html>
