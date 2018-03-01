function validchar(validstr, tocheck) {
  for (i=0; i<tocheck.length; i++) {
    if (!( validstr.includes(tocheck[i]) )) {
      return false;
    }
  }
  return true;
}

const lowerchar = "abcdefghijklmnopqrstuvwxyz";
const allowedchar = lowerchar + "- " + lowerchar.toUpperCase() + "0123456789";

function badtitle(titletext) {
  if (validchar(allowedchar, titletext)) {
    return false;
  }
  return true;
}

$(document).ready(function(){
  console.log('articlecreate.js loaded');


//adding fields from database
$.ajax({
  url: '/getfields',
  data: {
    //empty
  },
  type: 'GET',
  datatype: 'json',
  success: function(data) {
    var parsedobj = JSON.parse(data);
    var numFields = parsedobj.fields.length;
    for(var i=0; i<numFields; i++) {
      var option = $('<option>');
      option.attr('value', parsedobj.fields[i]);
      option.html(parsedobj.fields[i]);
     $('#field').append(option);
   }

  },
  error: function(req) {
    console.log('Error occured' + req);
  }
});

  $('#submit').click(function(){
    //check for bad inputs
    var title_in = $('#title').val();
    var type_in = $('#type').val();
    var field_in = $('#field').val();
    var level_in = $('#level').val();
    var user_in = $('#username').html();
    var content_in =$('#content').val();
    //check for title usernametaken


    //check for bad inputs to create form
    if (title_in.length == 0) {
      $('#returnmessage').text('Title field must not be blank');
    }
    else if (badtitle(title_in)) {
      $('#returnmessage').text('Title contains invalid characters');
    }
    else if (title_in.length > 30) {
      $('#returnmessage').text('Title must contain 30 or less characters');
    }
    else if (content_in.length == 0) {
      $('#returnmessage').text('Content cannot be blank');
    }
    else {
      //create the article in database and content folder
      $.ajax({
        url: '/articlecreate',
        data: {
          title : title_in,
          type : type_in,
          field : field_in,
          level: level_in,
          user: user_in,
          content : content_in
        },
        type : 'POST',
        datatype : 'text',
        success: function(data) {

          console.log('returned' + data);
          if (data == "Knowl exists") {
            $('#returnmessage').text('Title with level, type and field already exists');
          } else {
            $('#returnmessage').text('Creation Successful!');
          }
          //$('.newarticle').append(data).css('color', 'red');
        },

        error: function(request) {
          console.log('error occured in articlecreate ajax ' + request.type);
        }
      });
    }
  });

  $('#addknowlbutton').click(function() {
    var selStart = $('#content').prop('selectionStart');
    var selEnd = $('#content').prop('selectionEnd');
    var text = $('#content').val();
    var title = $('#addlink').val();
    let id = $("option[value='" + title + "']").attr('data-id');
    //ajax request for my_path
    $.ajax({
    url: '/getpathfromid',
    data: {'id': id},
    type: 'POST',
    datatype: 'text',
    success: function(data) {
      //console.log('received json of: ' + data);
      let path = data;
      //CHECK FOR INVALID LINK IN input
      if (path == undefined) {
        $('#linkmessage').text("Link invalid/path data not gotten");
      }
      else if (selStart === selEnd) {
        //if no highlight add to end
        let snippet =
          '<a knowl= "' + path + '">Text to link here</a>';
        text = text + snippet;
        $('#linkmessage').text('Link added successfully');
        $('#content').val(text);
      }
      else {
        //if highlighted
        var selText = $('#content')
          .val()
          .substring(selStart, selEnd);
        let snippet =
          '<a knowl= "' + path + '">' + selText + '</a>';
        var start = text.substring(0, selStart);
        var end = text.substring(selEnd, text.length);
        text = start + snippet + end;
        $('#linkmessage').text('Link added successfully');
        $('#content').val(text);
      }


  },
  error: function(error) {
    console.log(error);
  }
        });
  });

  $('.maximizebar').hide();
  $('.newarticle').hide();

  $('#addknowl').click(function(){
    $('.newarticle').show();
    $('.maximizebar').hide();
  });

  $('.minimizebar').click(function(){
    $('.newarticle').hide();
    $('.maximizebar').show();
  });

  $('.maximizebar').click(function(){
    $('.newarticle').show();
    $('.maximizebar').hide();
  });
});
