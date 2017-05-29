$server = mysql_connect("localhost","jfreeze","xBngNRS3");
$db =  mysql_select_db("jfreeze",$server);
$query = mysql_query("Insert into User Values($_POST["usernamefield"],  ");

<table class="striped">
    <tr class="header">
        <td>adminID</td>
        <td>genre</td>
        <td>superAdmin</td>
    </tr>
    <?php
  while ($row = mysql_fetch_array($query)){

    echo "<tr>";
    echo "<td>".$row['adminID']."</td>";
    echo "<td>".$row['genre']."</td>";
    echo "<td>".$row['superAdmin']."</td>";
    echo "<tr>";
  }
    ?>
</table>