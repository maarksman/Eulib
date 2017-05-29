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

<h1>Article Updated Successfully</h1>

<?php

$server = mysql_connect("localhost","jfreeze","xBngNRS3");
$db =  mysql_select_db("jfreeze",$server);

$maxID = mysql_query("SELECT MAX(id) FROM Article");
$rowID = mysql_fetch_row($maxID);
$id = $rowID[0]+1;

$title = $_POST['title'];
$category = $_POST['category'];
$body = $_POST['body'];
$last_edited = date('Y-m-d');
$idnum=$_POST['submit'];
echo $idnum;
echo $title;
echo $category;
echo $body;
echo $last_edited;
echo $idnum;


$server = mysql_connect("localhost","jfreeze","xBngNRS3");
$db =  mysql_select_db("jfreeze",$server);
$query = mysql_query("Update Article set title='$title',last_edited='$last_edited',belongs_to = '$category',content='$body' where id='$idnum'");
echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=mainscreen.php">';
//$numberChange = mysqli_affected_rows($query);

/*if ($outcome===true) {
    print "sucess!";
}

else {
    echo 'There is an error'. $error ."<br />\n";

}*/

?>
</body>
</html>