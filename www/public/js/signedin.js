var backgroundColor;
var color;

$(document).ready(function() {
  console.log('signedin.js running');
  //if user clicks the the button with id change_theme, run change_theme function
  $('#change_theme').click(change_theme);
  $('#signout').click(signout);
});

function signout() {
  console.log("Signing out!")
  $.ajax({
    url: '/signout',
    data: {},
    type: 'GET',
    success: function(data) {
      window.location.replace("http://localhost:3000/");
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function change_theme() {

  //making the change in the theme
  var theme;
  console.log('function run');
  console.log($('#change_theme').html())
  if($('#change_theme').html() == 'Dark Mode'){
    theme = '1';
    console.log('we come here 1');
    backgroundColor = 'black';
    color = 'white';
    //change the name of the button to light mode after switching to dark mode
    $('#change_theme').html('Light Mode');
  } else if($('#change_theme').html() == 'Light Mode'){
    theme = '0';
    console.log('we come here')
    backgroundColor = 'white';
    color = 'black';
    //change the button name to dark mode after switching to light mode
    $('#change_theme').html('Dark Mode');
  }
  setTheme();

//also telling the server that the change has been made
  $.ajax({
    url: '/changeTheme',
    data: {'theme' : theme},
    type: 'POST',
    success: function(data){
      console.log('changeTheme POST returned'+ data);
    },
    error: function(err){
      console.log('something went wrong in changing the theme');
    }
  });

}


function setTheme() {

  //this if statement is for the first time. As you can see this is the second time I'm checking for light mode and dark mode.
  //I belive that this code can be made more compact in the future if we wish
  if($('#change_theme').html() == 'Light Mode') {
    backgroundColor = 'black';
    color = 'white';
  } else if ($('#change_theme').html() == 'Dark Mode') {
    backgroundColor = 'white';
    color = 'black';
  }
  $('body').css('background-color', backgroundColor);
  $('body').css('color', color);
}
