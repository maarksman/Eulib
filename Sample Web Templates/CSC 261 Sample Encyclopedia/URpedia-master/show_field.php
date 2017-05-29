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


$server = mysql_connect("localhost","jshang5","iEXDfQqe");
$db =  mysql_select_db("jshang5",$server);
$query = mysql_query("select * from Field");

?>

<table class = "striped">
    <tr class = "header">
        <td>field</td>
        <td>subfield_of</td>
    </tr>
    <?php
  while ($row = mysql_fetch_array($query)){

           echo "<tr>";
           echo "<td>".$row['field']."</td>";
           echo "<td>".$row['subfield_of']."</td>";
  }
    ?>
</table>
</body>
</html>