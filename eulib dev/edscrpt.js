$(document).ready(function()
{
  var text = 'Long, long after a time there comes a wonderful day, when spring starts with a shine, you can wonder what I say';
  $('body').append('<div class = "noedit"><p>'+ text +'</p></div>');
  $('body').append('<textarea class = "edit">'+text+' </textarea>');
  $('body').append('<button class = "save">Save</button>');

  $('.edit').hide();

  $('.noedit').click(function(){
    $('.noedit').hide();
    $('.edit').show();
  });

//click save
  $('.save').click(function(){
    text = $('.edit').val();
    $('.edit').hide();
    $('.noedit').html('<p>'+ text +'</p>');
    $('.noedit').show();
  });

});
