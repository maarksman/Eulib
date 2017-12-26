//JS file for new_sign_in_page.html
//and new_sign_up_page.html
//console.log("scriptmysql.js is running");
//making checks for valid e-mail and valid username
function validchar(validstr, tocheck) {
  for (i=0; i<tocheck.length; i++) {
    if (!( validstr.includes(tocheck[i]) )) {
      return false;
    }
  }
  return true;
}

const lowerchar = "abcdefghijklmnopqrstuvwxyz";
const allowedchar = lowerchar + "-" + lowerchar.toUpperCase() + "0123456789";
const validemailchar = lowerchar + lowerchar.toUpperCase() + "0123456789.-@";

//check e-mail
function bademail(tocheck) {
  if (!tocheck.includes('@') || !tocheck.includes('.'))
  {
    return true;
  }
  else if (tocheck.indexOf('@') != tocheck.lastIndexOf('@')) {
    return true;
  }
  else if (tocheck.lastIndexOf('.') < tocheck.indexOf('@')) {
    return true;
  }
  else if (!validchar(validemailchar, tocheck)) {
    return true;
  }
  return false;
}


//chck titile
function badusername(titletext) {
  if (validchar(allowedchar, titletext)) {
    return false;
  }
  return true;
}

$(document).ready(function() {
  console.log("jQuery is running too");
  $("#signin_button").click(load_signed_in_user);
  $('#signup_button').click(signup_request);
  $('#password').click(make_border_black);
  $('#conf_password').click(make_border_black);
});

var load_signed_in_user = function() {
  var username_input = $("#username").val();
  var password_input = $('#password').val();
  //var remember_me = $('#rememberme_check').val()
  //console.log("login started for: "+username_input);
  $.ajax({
    url: '/signin',
    data: {
      username : username_input,
      password : password_input,
    },
    type: 'POST',
    dataType: 'html',
    success: function(data){
      //console.log("data: "+data);
      ///for some reason this always tried to post to indexsignedin unsuccessfully.
      //force redirect, session username will still be set and allow login redirect to work
      if(data.includes("invalid")){

        window.location.replace("/");
        $("#username").css("border-color","red");
        $("#password").css("border-color","red");
        alert("incorrect username or password, redirecting to home page.");

      }
      else{
         window.location.replace(data);
       }
    },

    error: function(request) {
      //console.log("an error occured:"+request);
      console.log("Empty password field or user does not exist.");
      window.location.replace("/");
    }

  });
}
var password_match_error = function(){
  $("#password").css("border-color", "red");
  alert("Passwords do not match");
}


var make_border_black = function() {
  $("#password").css("border-color", "blue");
  //$("#password").css("border-style","solid");
  $("#conf_password").css("border-color", "black");
}
//validates input username isn't taken, email properly formated, password meets length requirement
//runs a login request if remember me is checked
var signup_request = function() {
  console.log('signup_request initiated');
  var username_input = $("#username").val();
  var email_input = $("#email").val();
  var password_input = $("#password").val();
  var conf_password_input = $("#conf_password").val();
  var checked = $("#checkbox").is(":checked");
  //make sure not empty
  if(!username_input.length==0 || !email_input.length==0 || !password_input.length==0){
    //console.log(checked);
    if (badusername(username_input)) {
      alert("Username has invalid characters");
      $("input").css("border-color","white");
      $("#username").css("border-color","red");

    }
    else if (username_input.length > 25) {
      alert("Username must be less than 25 characters");
      $("input").css("border-color","white");
      $("#username").css("border-color","red");
    }
    else if (bademail(email_input)) {
      alert("E-mail is not valid");
      $("input").css("border-color","white");
      $("#email").css("border-color","red");
    }
    else if (password_input.length < 4) {
      alert("Password must be 4 or more characters");
      $("input").css("border-color","white");
      $("#password").css("border-color","red");
    }
    else if(password_input == conf_password_input) {
      //console.log("Starting ajax")
      $.ajax({
        url: '/create_user',
        data: {
          username : username_input,
          email : email_input,
          password : password_input,
        },
        type: 'POST',
        dataType: 'html',
        success: function(data){
          //document.write("account created\n" + data);
          //$('body').html(data);
          // go to the success page after clicking sign up button
          //window.location.replace("/html/sign_up_success_page.html");
          if(data.includes("taken")){
            alert(data);
          }
          else{
            if(checked==true){
                //console.log("Load signed in")
                load_signed_in_user();

            }
            else{
              window.location.replace("/");
            }
          }

          //window.location.replace("success_signup_page.html");
        },
        error: function(request) {
          console.log("an error occured" + request);
        }
      })

    } else {
      alert("Passwords do not match");
      //console.log("passwords do not match")
      $("input").css("border-color","white");
      $("#error_message").html("passwords do not match");
      $("#password").css("border-color","red");
      $("#conf_password").css("border-color","red");

    }
  }
  else{
    //console.log("one of the fields is empty")
    alert("One or more of the fields are empty");
    // console.log(username_input.length)
    // console.log(email_input.length)
    // console.log(password_input.length)
  }

}
