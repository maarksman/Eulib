function validchar(validstr, tocheck) {
  for (i=0; i<tocheck.length; i++) {
    if (!( validstr.includes(tocheck[i]) )) {
      return false;
    }
  }
  return true;
}

const lowerchar = "abcdefghijklmnopqrstuvwxyz";
const allowedchar = lowerchar + "-() " + lowerchar.toUpperCase() + "0123456789";

function badtitle(titletext) {
  if (validchar(allowedchar, titletext)) {
    return false;
  }
  return true;
}

function isYoutube(link) {
  var matches = link.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
  return matches;
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
     $('#fieldlist').append(option);
   }

  },
  error: function(req) {
    console.log('Error occured' + req);
  }
});

  $('#submit').on('click', function(e){
    function validfield(textin) {
      thefield = $("#fieldlist option[value='" + textin + "']").attr('value')[0];
      if (textin == thefield) {
        return true;
      } else {
        return false;
      }
    }

    //prevent page refresh
    $("#submit").html("Submitting");
    //check for bad inputs
    var title_in = $('#title').val();
    var type_in = $('#type').val();
    var field_in = $('#field').val();
    var level_in = $('#level').val();
    var content_in =$('#content').val();


    //get file uploaded, check for valid size image before upload



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
    else if (validfield(field_in)) {
      $('#returnmessage').text('Must use valid field');
    }
    else {
      //update button text
      $("#submit").html('Submitting');

      //get file here

      let fileselect = document.getElementById('file-select');
      let filelist = fileselect.files;
      let toserver = {
        title : title_in,
        type : type_in,
        field : field_in,
        level: level_in,
        content : content_in
      };
      //check if file there, if so adjust data sent
      let formdata = new FormData();
      let objkeys = Object.keys(toserver);
      console.log('objkeys', objkeys);
      // append to formData
      for (i=0; i<objkeys.length;i++) {
        let key = objkeys[i];
        formdata.append(key, toserver[key]);
      }

      //if file present add it to formdata
      if (filelist.length == 1) {
        let file = filelist[0];
        if (file.type.match('image.*')) {
          formdata.append('knowlimage', file, file.name);
        }
      }

      //checking the formdata
      for (var key of formdata.keys()) {
        console.log('key/value of formdata', key, formdata.get(key));
      }

      //create the article in database and content folder
      $.ajax({
        url: '/articlecreate',
        data: formdata,
        type : 'POST',
        contentType:false,
        processData: false,
        datatype : 'text',
        success: function(data) {

          console.log('returned' + data);
          if (data == "Knowl exists") {
            $('#returnmessage').text('Title with level, type and field already exists');
          } else {
            $('#returnmessage').text('Creation Successful!');
            $('.newarticle').find('input:text').val('');
            $('.newarticle').find('textarea').val('');
            $('#linkmessage').empty();
            $('#returnmessage').empty();
            $('.newarticle').hide();
            //popupAlert();
          }
        },

        error: function(request) {
          console.log('error occured in articlecreate ajax ' + request.type);
        }
      }).always( function() {
            $('#submit').html("Submit");
      }); // end always of ajax;
    }
  });

  $('#addknowlbutton').click(function() {
    var selStart = $('#content').prop('selectionStart');
    var selEnd = $('#content').prop('selectionEnd');
    var text = $('#content').val();
    var title = $('#addlink').val();
    let id = $("option[value='" + title + "']").attr('data-id');
    console.log('id--: ' + id);
    console.log("title: " + title);
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
        if (path == 'undefined') {
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
    }); //end ajax
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

  $('.closebar').click(function() {
     $('.newarticle').find('input:text').val('');
     $('.newarticle').find('textarea').val('');
     $('#linkmessage').empty();
     $('#returnmessage').empty();
     $('.newarticle').hide();
  });

  $('.maximizebar').click(function(){
    $('.newarticle').show();
    $('.maximizebar').hide();
  });
});
