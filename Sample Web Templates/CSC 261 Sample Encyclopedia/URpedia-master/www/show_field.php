<html>
<head>
<style>

table, th, td {
    border: 1px solid black;
}
</style>
</head>
    
    

<body>

<table>
    <tr>
        <th>field</th>
        <th>subfield_of</th>
    </tr>

<?php


$server = mysql_connect("localhost","jfreeze","xBngNRS3");
$db =  mysql_select_db("jfreeze",$server);
$query   = mysql_query("select * from Field");
while ($row = mysql_fetch_array($query)){

  echo "<tr>";
?>

  <td><form id="article" method="post" action="show_article2.php" >
        <input type="submit" name="Article" id="Article" value="<?php echo $row['field'] ?>">
      </form>
  </td>

<?php
  echo "<td>".$row["subfield_of"]."</td>";
}
?>




           
           

</table>
</body>
</html>