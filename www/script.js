//JS file for index.html
//and signup.html
console.log("script.js is running");

$(document).ready(function() {
  console.log("jQuery is running too");
  $('#signup_button').click(signup_request);
  $('#show_db_button').click(db_show_request);
  $('#password').click(make_border_black);
  $('#conf_password').click(make_border_black);
  $('#signin_button').click(load_signed_in_user);
  setTheme();

});


function setTheme() {
  $.ajax({
    url: 'cgi-bin/theme.py',
    dataType: 'json',
    success: function(data){
      if(data['theme'] == '1'){
        $('#theme').html('Light Mode');
      } else {
        $('#theme').html('Dark Mode')
      }
    }

  });
}

var load_signed_in_user = function() {

  var username_input = $("#username").val();
  var password_input = $('#password').val();
  var remember_me = $('#rememberme_check').val()
  console.log("login started for: "+username_input);
  $.ajax({

    url: 'cgi-bin/login_check.py',
    data: {
      username : username_input,
      //email : email_input,
      password : password_input,


    },
    type: 'GET',
    dataType: 'html',
    success: function(data){
      if("password matches\n" == data){
        // console.log("locale compare: "+ "password matches\n".localeCompare(data)+".");
        // console.log("in success");
        // console.log("data: \""+data+"\"")
        console.log('Welcome ' + username_input);
        //if(remember_me=)
      }
      else{
        //console.log(data);
        password_match_error();

      }
    },

    error: function(request) {
      //console.log("an error occured:"+request);
      console.log("Empty password field or user does not exist.");
    }

  })




}
var password_match_error = function(){
  $("#password").css("border-color", "red");
  $("#error").html("<p>Incorrect Password or username!</>");
}


var make_border_black = function() {
  $("#password").css("border-color", "black");
  $("#conf_password").css("border-color", "black");
}

var signup_request = function() {
  console.log('signup_request initiated');
  var username_input = $("#username").val();
  var email_input = $("#email").val();
  var password_input = $("#password").val();
  var conf_password_input = $("#conf_password").val();
  $('#error').empty()
  $('#error').html(email_input)
  if($('#error').val() !=''){
  if(password_input == conf_password_input) {

    $.ajax({
      url: 'cgi-bin/check_db.py',
      data: {
        username : username_input,
        email : email_input,
        password : password_input,
      },
      type: 'POST',
      dataType: 'html',
      success: function(data){
        console.log("in success");
      },
      error: function(request) {
        console.log("an error occured");
      }
    })

  } else {
    console.log("passwords do not match")
    $("#error_message").html("passwords do not match");
    $("#password").css("border-color","red");
    $("#conf_password").css("border-color","red");

  }
}
  else{
    console.log("field empty.")
  }
}

var db_show_request = function() {
  console.log('db_show_request initiated');

  $.ajax({
    url: 'cgi-bin/show_db.py',
    data: {},
    type: 'GET',
    dataType: 'html',
    success: function (data) {
      console.log('we return with success!')
      $('#database_show').html(data);
    },
    error: function(request) {
      console.log("error occured in show_db_request ajax")
    }
  })
}
