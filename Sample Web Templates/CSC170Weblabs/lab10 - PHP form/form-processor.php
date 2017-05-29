<?php

// set some variables
$emailFrom = "mauden@u.rochester.edu";
$emailTo = "mauden@u.rochester.edu";
$subject = "Lab 10 - HTML Form"; // every statement ends in semi-colon

// grab data being passed from the method="post" in the HTML form
// and hold each in variables
$name = $_POST["name"];  //name variable is from html form input type
$email = $_POST["email"]; 
$phone = $_POST["phone"]; 

Trim(stripslashes($_POST["name"]));
Trim(stripslashes($_POST["email"]));
Trim(stripslashes($_POST["phone"]));
//looks for fomr characters and cuts them out- html forms can be hacked (cool)

$checkfirefox = $_POST["firefox1"]; // name from input type. repeat for all input types
$checkchrome = $_POST["chrome1"];
$checksafari = $_POST["safari1"];
$checkie = $_POST["ie1"];
$checkedge = $_POST["edge1"];


$browserSelect = $_POST["browser"];

$message = Trim(stripslashes($_POST["message"]));



// prepare e-mail body text
$body = "";  // Initialize the variable

$body .= "Name: ";
$body .= $name;
$body .= "\n";

$body .= "Email: ";
$body .= $email;
$body .= "\n";

$body .= "Phone: ";
$body .= $phone;
$body .= "\n\n";

$body .= "Browsers used = \n";
$body .= $checkfirefox;
$body .= "\n";  // repeat last 2 lines for all browsers
$body .= $checkchrome;
$body .= "\n";
$body .= $checksafari;
$body .= "\n";
$body .= $checkie;
$body .= "\n";
$body .= $checkedge;
$body .= "\n\n";

$body .= "Favorite Browser: \n";
$body .= $browserSelect;
$body .= "\n"

$body .= "Message: \n";
$body .= $message;
$body .= "\n";


// send e-mail
mail($emailTo, $subject, $body, "From: <$emailFrom>");

//send the user to the thank you webpage

// PHP stands for  "PHP Hypertext Processor"

header("Location: contact-thanks.html"); 
?>