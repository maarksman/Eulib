$(document).ready(function()
{
  var text = '<p>Long, long after a time there comes a wonderful day, when spring starts with a shine, you can wonder what I say</p>';
  $('body').append('<div class = "mNoedit">'+ text +'</div>');
  $('body').append('<textarea class = "mEdit">'+text+' </textarea>');
  $('body').append('<input class = "search" list = "results" ><datalist id="results"><option value = "topology.html"/><option value = "linearalgebra.html"/></datalist></input>');
  $('body').append('<button class = "add">Add</button>');
  $('body').append('<button class = "save">Save</button>');
  $('body').append('<button class = "edit">Edit</button>');

  $('.search').hide();
  $('.add').hide();
  $('.mEdit').hide();

  $('.edit').click(function(){
    $('.mNoedit').hide();
    $('.mEdit').show();
    $('.search').show();
    $('.add').show();

  });

//click save
  $('.save').click(function(){
    text = $('.mEdit').val();
    $('.mEdit').hide();
    $('.mNoedit').html(text);
    $('.mNoedit').show();
  });

  //click add
  $('.add').click(function(){
    var link = $('.search').val();
    var snippet = '<a knowl= " ' + link + '" href = "' + link+ '"></a>';
    var cursorPosition = $('.mEdit').prop('selectionStart');
    console.log(cursorPosition);
    var start = text.substring(1,cursorPosition);
    var end = text.substring(cursorPosition, text.length);
    text=start + snippet + end;
    $('.mEdit').html(text);

  });



});
