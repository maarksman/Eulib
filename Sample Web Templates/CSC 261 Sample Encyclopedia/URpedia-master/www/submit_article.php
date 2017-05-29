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

$maxID = mysql_query("SELECT MAX(id) FROM Article");
$rowID = mysql_fetch_row($maxID);
$id = $rowID[0]+1;

$title = $_POST['title'];
$creator = $_COOKIE["username"];
$editing_level = (int)$_POST['editing_level'];
$category = $_POST['category'];
$body = $_POST['body'];
$last_edited = date('Y-m-d');

if($editing_level>=1 && $editing_level<=4) {
    $server = mysql_connect("localhost","jfreeze","xBngNRS3");
    $db =  mysql_select_db("jfreeze",$server);
    $query = mysql_query("INSERT INTO Article (id,title,last_edited,editing_level,creator,belongs_to,content) 
    VALUES ('$id','$title','$last_edited','$editing_level','$creator','$category','$body')");
    echo "<h1>Article Created Successfully</h1>";
    echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=mainscreen.php">';
//$numberChange = mysqli_affected_rows($query);

/*if ($outcome===true) {
    print "sucess!";
}

else {
    echo 'There is an error'. $error ."<br />\n";

}*/
}
else{
        echo '<META HTTP-EQUIV=refresh CONTENT="1;URL=CreateArticle.php">';
        echo '<h1 id="notEqual-header">';
        echo            'Invalid Editing Level!';
        echo       '</h1>';
    }


?>
</body>
</html>