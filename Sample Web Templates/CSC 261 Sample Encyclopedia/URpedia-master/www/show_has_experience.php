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
$query = mysql_query("select * from Has_Experience");

?>

<table class="striped">
    <tr class="header">
        <td>username</td>
        <td>field</td>
        <td>level</td>
    </tr>
    <?php
  while ($row = mysql_fetch_array($query)){

    echo "<tr>";
    echo "<td>".$row['username']."</td>";
    echo "<td>".$row['field']."</td>";
    echo "<td>".$row['level']."</td>";
    echo "<tr>";
  }
    ?>
</table>
</body>
</html>