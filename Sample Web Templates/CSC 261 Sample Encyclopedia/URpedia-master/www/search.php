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
        <title>Search Results</title>
    </head>
    <body>



<table class="striped">
    <tr class="header">
        <td>id</td>
        <td>title</td>
        <td>last_edited</td>
        <td>editing_level</td>
        <td>creator</td>
        <td>belongs_to</td>
        <td>content</td>
    </tr>
    <?php

    $srch = $_POST['searchbut'];
    echo $srch;

$server = mysql_connect("localhost","jfreeze","xBngNRS3");
$db =  mysql_select_db("jfreeze",$server);
$query = mysql_query("select * from Article where content like '%{$srch}%'");
  while ($row = mysql_fetch_array($query)){
       
           echo "<tr>";
           echo "<td>".$row['id']."</td>";
           echo "<td>".$row['title']."</td>";
           echo "<td>".$row['last_edited']."</td>";
           echo "<td>".$row['editing_level']."</td>";
           echo "<td>".$row['creator']."</td>";
           echo "<td>".$row['belongs_to']."</td>";
           echo "<td>".$row['content']."</td>";
           echo "<tr>";
  }
    ?>
</table>
</body>
</html>
