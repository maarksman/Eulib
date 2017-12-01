$(document).ready(function()
{
  console.log("hello");
  var text = 'Long, long after a time there comes a wonderful day, when spring starts with a shine, you can wonder what I say';
  $('body').append('<div class = "noedit"><p>'+ text +'</p></div>');

  $('.noedit').click(function(){
    $('.noedit').remove();
    $('body').append('<textarea class = "edit">'+text+' </textarea>');
  });

});
