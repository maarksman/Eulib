var textarea = $('#mEdit');
var text;
var title;
var path;
$(document).ready(function() {
  //load_js();
  console.log('searcharticlelive');
  /*$("#dialogbox").dialog({
    autoOpen:false,
    modal:true,
    title: "Use of Open event",
    width:300,
});*/

  //function for article left-right
  $(document).on('click', '.button', function(e){
    //add changing id to remove later

    $(this).closest(".boxedin").attr("id", 'changing');
    let newid = $(this).attr('data-id');
    let previd = $('#changing').attr('data-id');
    let leftorright = $(this).hasClass('leftbutton') ? 'left' : 'right';
    console.log('Registered '+ leftorright + ' click');
    //get content, remove content div then add new content
    let clickedbutton = $(this);
    let changeknowl = $(this).parent();
    //double check parent is Jquery sintax;

    $.ajax({
      url: '/arrowcontent',
      data: {'clickedid': newid, 'leftorright':leftorright},
      type: 'POST',
      datatype: 'json',
      success: function(data) {
        //console.log('data came back as: ' + data);
        console.log("Fired arrowcontent change request");
        let myobj = JSON.parse(data);
        /*console.log('returned content is:');
        console.log(myobj.content); */
        console.log('showing returned json');
        console.log(myobj);

        if (myobj.found) {
          $("#changing").children().remove('.knowlcontent1');
          let newdiv = $("<div class='knowlcontent1'>" + myobj.content + "</div>");
          $('#changing').append(newdiv);
          //do required changes, then use left/right for next button left/right
          $('#changing').attr('data-id', newid);
          if (leftorright == 'left') {
            $('#changing').children('.rightbutton').attr('data-id', previd)
            $('#changing').children('.rightbutton').show();
            if (myobj.islast) {
              $('#changing').children('.leftbutton').hide()
              $('#changing').children('.leftbutton').attr('data-id', "");
            }
            else {
              $('#changing').children('.leftbutton').attr('data-id', myobj.nextid);
              $('#changing').children('.leftbutton').show();
            }
          }
          if (leftorright == 'right') {
            $('#changing').children('.leftbutton').attr('data-id', previd);
            $('#changing').children('.leftbutton').show();
            if (myobj.islast) {
              $('#changing').children('.rightbutton').hide();
              $('#changing').children('.rightbutton').attr('data-id', "");
            }
            else {
              $('#changing').children('.rightbutton').attr('data-id', myobj.nextid);
              $('#changing').children('.rightbutton').show();
            }
          }
        }
        //if  not found, send alert and do nothing
        else {
          alert("No record of id on arrow button");
        }
        $('div#changing').removeAttr('id');
      },
      error: function(error) {
        console.log(error);
        $('div#changing').removeAttr('id');
      }
    });
  });


  $('#search').on('keyup', function(e){
    //clear original datalist
    $('#articles').html("");
    //get current search value
    let cursearch = $('#search').val()
    //use "badtitle' function from articlecreate file to check chars"
    if (badtitle(cursearch) || cursearch.length > 50) {
      $('#search').css("border", "solid 2px");
      $('#search').css('border-color', 'red');
    } else {
      $('#search').css("border", "none");
      $('#search').css('border-color', 'white');
      search($('#search'), $('#articles')) ;
    }
  });

  $('#search_button').on("click",function(e){
    redir($('#search'));
  });

  $('#search_all').on("click",function(e){
    //get num suggestions
    redirall($('#articles'));
    showedit();
  });

  $('.close').on('click',function(){
    console.log("close clicked")
  });

  $('#addlink').on('keyup', function(e){
    //clear original datalist
    $('#linkstoadd').html("");
    search($('#addlink'), $('#linkstoadd'));
  });

  $('#editAddLink').on("select", function() {
        console.log("edit add link pressed");

  });

  $(document).on('click','.editerB', function() {
    //console.log("edit");
    //id is put into div covering entire article and into another div which holds the text area
    //grab the id from outer div
    textid= $(this).closest("[data-id]").attr('data-id');
    //grab the div containing the textarea based on the id
    //<div><textarea></ta></div>
    textarea=$(this).closest("[data-id='" + textid + "']").children(".editbox");
    //grabs the parent of editerB and finds the last div which is the text of the article
    text=$(this).closest("div").children(".knowlcontent1");
    /*
    title = $(this).closest("div").attr("data-title");
    path = $(this).closest("div").attr("data-path");
    */
    var addLinkOptions = document.getElementById('addLinkOptions');
    addLinkOptions.style.display = '';
    if($(textarea).css("display")=="none"){
      //console.log("show");
      $(textarea).css("display","block");
      $(textarea).children("textarea").val(text.html());
      $(text).css("display","none");
      $(this).text("Save");
    }else{
      //console.log("hide+save");
      let postcontent = $(textarea).children("textarea").val();
      $(textarea).css("display","none");
      $(text).html(postcontent);
      $(text).css("display","block");
      saveArticle(textid,textarea.children("textarea").val());
      $(this).text("Edit");
      addLinkOptions.style.display = 'none';
    }
    $('#editAddLink').on('keyup', function(){
      //console.log("edit add link key up");
      //clear original datalist
      $('#editlinkstoadd').html("");
      search($('#editAddLink'), $('#editlinkstoadd'));
    });

  });



  $(document).on('click','#addLinkButton', function() {
    console.log("TESTING");
    var selStart = $('#editContent').prop('selectionStart');
    var selEnd = $('#editContent').prop('selectionEnd');
    var text = $('#editContent').val();
    var title = $('#editAddLink').val();
    let id = $("option[value='" + title + "']").attr('data-id');
    //console.log("id: " + id);
    //console.log("title: " + title);
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
        $('#editLinkMessage').text("Link invalid/path data not gotten");
      } else if (selStart === selEnd) {
        //if no highlight add to end
        let snippet = '<a knowl= "' + path + '">Text to link here</a>';
        text = text + snippet;
        $('#editLinkMessage').text('Link added successfully');
        $('#editContent').val(text);
      } else {
        //if highlighted
        var selText = $('#editContent')
        .val()
        .substring(selStart, selEnd);
        let snippet =
        '<a knowl= "' + path + '">' + selText + '</a>';
        var start = text.substring(0, selStart);
        var end = text.substring(selEnd, text.length);
        text = start + snippet + end;
        $('#editLinkMessage').text('Link added successfully');
        $('#editContent').val(text);
      }


    },
    error: function(error) {
      console.log(error);
    }
  });
  });
});

function saveArticle($inputid, $inputcontent){
  var id = ($inputid);
  var my_content = ($inputcontent);
  console.log("got id and content as:", id, my_content);
  //console.log(my_search);
  //console.log(my_content);
  $.ajax({
    url: '/updatearticle',
    data: {'id': id, 'content': my_content},
    type: 'POST',
    datatype: 'html',
    success: function(data) {
      alert(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
}
function search($inputid, $datalist){
  console.log("searching");
  //clear original datalist

  var my_search = ($inputid.val());

  //check input and submit only on valid search


    //TODO sql search for articles including text

    $.ajax({
     url: '/searcharticle',
     data: {'search-text': my_search},
     type: 'POST',
     datatype: 'html',
     success: function(data) {
       $datalist.html(data);

         //clear original datalist of children
         //parse data of title and infotyp
         // apppedchild to datalist
       },
       error: function(error) {
         console.log(error);
       }
     });
  }

//renders article from searchbox to page
function redir($inputid){
    //get id from jquery search selesctor
    var my_search = ($inputid.val());
    let id = $("#articles option[value='" + my_search + "']").attr('data-id');
    // check for valid title, if not don't Submit
    if (badtitle(my_search) || my_search.length <1
      || my_search.length > 50 || id == undefined
      )
    {
      alert("Invalid search!!");
    } else {
      var style;
      $.ajax({
        url: '/indexshoweditsection',
        data: {},
        type: 'POST',
        datatype: 'json',
        success: function(data) {
          console.log(data.type);
          console.log("none" == data);
            if ("in" == data) {
              style = "";
            } else if ("out" == data) {
              style = "none";
            }
        }, error: function(error) {
          console.log(error);
        }
      });
      $.ajax({
        url: '/searcharticleredir',
        data: {'id': id},
        type: 'POST',
        datatype: 'json',
        success: function(data) {
            //console.log('received json of: ' + data);
            myObj = JSON.parse(data);
            console.log(data);
            //<button onclick=\"bookmarkDiv(this)\" type=\"button\">Bookmark</button>\
            if (!myObj.articlefound) {
              alert('"'+ my_search + '" not in database, please try again');
            }
            else {
              var div = $(
                "<div id='adding'" + " data-id=" + myObj.id + "> \
                <select id=\"addingfields\"> <option value=\"value1 placeholder\">val1</option><option value=\"val2\">val2</option></select> \
                <button id='editButton' class=\"editerB "+myObj.id+  " knowl-button " + "\"type=\"button\" style='display:"+style+";'>Edit</button>\
                <button class=\" knowl-button \"  onclick=\"removeDiv(this)\" type=\"button\">X</button>\
                <div id='addLinkOptions' style='display: none'>\
                <span>Add Knowl Link</span>\
                <input id='editAddLink' list='editlinkstoadd' name='titlelist'>\
                <br><datalist id='editlinkstoadd'></datalist>\
                <button class=\" addLinkButton \" id='addLinkButton' style=\"\" type=\"button\">Add Link</button>\
                </div>\
                <div class =\"editbox\" style=\"display:none;\">  <textarea style=\"width:100%;height:220px;\" id='editContent'></textarea></div>"
                + `<button class="leftbutton button" data-id=""> < </button>
                <button class="rightbutton button" data-id=""> > </button>`
                + "<div class='knowlcontent1'>" + myObj.content + "</div>" +
                "<div class='knowlfooter border border-dark'>" +
                "<a href=''>link 1 </a>" +  "<a href=''>link 2 </a>" +  "<a href=''>link 3</a>" +
                "</div>"+
                "</div>");

            //$('#articles-searched').prepend(div.addClass("boxed"));
            $('#entry-content').prepend(div.addClass("boxedin"));
            for (i=0;i<myObj.fields.length;i++) {
              let fieldoption = $("<option value=\"" + myObj.fields[i].field + "\">" + myObj.fields[i].field  + "</option>");
              console.log('added options: ', fieldoption);
              $('select#addingfields').prepend(fieldoption);
            }
            $('#addingfields').removeAttr('id');
            if (!myObj.cangoleft) {
              $('#adding').children('.leftbutton').hide();
            } else {$('#adding').children('.leftbutton').attr('data-id', myObj.leftid);}
            if (!myObj.cangoright) {
              $('#adding').children('.rightbutton').hide();
            } else {$('#adding').children('.rightbutton').attr('data-id', myObj.rightid);}

            //on clientside, process teX equations after submit
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, $('#adding .knowlcontent1').get(0)]);

            //remove the marker of nowl we just added
            $('#adding').removeAttr('id');
          }
        },
        error: function(error) {
          console.log(error);
        }
      });
    }
  }

//return all search suggestions
function redirall($datalist){
    /*var my_search = ($inputid.val());
    let alistoption = $("#articles option[value='"+ my_search + "']");
    */
    //get list of ids to send
    let idlist = [];
    $datalist.children().each(function(index) {idlist.push($(this).attr('data-id'))});
    console.log('idlist is: ');
    console.log(idlist);
    //no search for no suggestions
    if ($datalist.children().length == 0) {
      alert("No suggestions to search");
    } else {
      $.ajax({
        url: '/multiarticleredir',
        data: {'idlist': idlist},
        type: 'POST',
        datatype: 'json',
        success: function(data) {
          //console.log('received json of: ' + data);
          myObj = JSON.parse(data);
          console.log("data from server is: ");
          console.log(data);
          //<button onclick=\"bookmarkDiv(this)\" type=\"button\">Bookmark</button>\
          if (myObj.numtorender == 0) {
            alert("Articles not in database, please try again");
          }
          else {
            for (i=0;i<myObj.numtorender;i++) {
              let curknowl = myObj.knowlinfo[i];
              if (curknowl.articlefound) {
                var username = req.session.username;
                console.log('username: ' + username);
                console.log('session object is');
                console.log(req.session);
                var div = $(
                  "<div id='adding'" +
                  " data-id=" + curknowl.id + " data-level='3'" + "> \
                  <select id=\"addingfields\"> <option value=\"value1 placeholder\">val1</option><option value=\"val2\">val2</option></select> \
                  <button id='editButton' class=\"editerB "+curknowl.id+  "\"type=\"button\"style='display: none;'>Edit</button>\
                  <button onclick=\"removeDiv(this)\" type=\"button\">X</button>\
                  <div id='addLinkOptions' style='display: none'>\
                  <span>Add Knowl Link</span>\
                  <input id='editAddLink' list=editlinkstoadd name='titlelist'>\
                  <br><datalist id='editlinkstoadd'></datalist>\
                  <button class=\" addLinkButton \" id='addLinkButton' style=\"\" type=\"button\">Add Link</button>\
                  </div>\
                  <div class ="+curknowl.id+" style=\"display:none;\"><textarea style=\"width:100%;height:220px;\" id='editContent'></textarea></div>"
                  + `<button class="leftbutton button" data-id=""> < </button>
                  <button class="rightbutton button" data-id=""> > </button>`
                  + "<div class='knowlcontent1 border border-dark'>" + curknowl.content + "</div>" +
                  "<a href=''>link 1 </a>" +  "<a href=''>link 2 </a>" +  "<a href=''>link 3</a>" +
                  "<span>footer will go here</span>" +
                  "</div>"+
                  "</div>");

                for (j=0;j<curknowl.fields.length;j++) {
                  let fieldoption = $("<option value=\"" +curknowl.fields[j].field + "\">val1</option>")
                  $('#addingfields').prepend(fieldoption)
                }
                $('#addingfields').removeAttr('id');
                //$('#articles-searched').prepend(div.addClass("boxed"));
                $('#entry-content').prepend(div.addClass("boxedin"));
                if (!curknowl.cangoleft) {
                  $('#adding').children('.leftbutton').hide();
                } else {$('#adding').children('.leftbutton').attr('data-id', curknowl.leftid);}
                if (!curknowl.cangoright) {
                  $('#adding').children('.rightbutton').hide();
                } else {$('#adding').children('.rightbutton').attr('data-id', curknowl.rightid);}
                //on clientside, process teX equations after submit
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, $('#adding .knowlcontent1').get(0)]);

                //remove the marker of nowl we just added
                $('#adding').removeAttr('id');
              }
            }
          }
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

  }

  function removeDiv(element){
    $(element).closest("div").remove();
  }

  function clearAllKnowls() {
    $('#articles-searched div').empty();
  }

  function popupAlert() {
    $('#dialogbox').html('<h2>Watch this</h2>An alert box should have opened');
    $('#dialogbox').dialog('open');
  }

  /*function showedit() {
    console.log("function called");
      $.ajax({
        url: '/indexshoweditsection',
        data: {},
        type: 'POST',
        datatype: 'json',
        success: function(data) {
          console.log(data.type);
          console.log("none" == data);
            if ("in" == data) {
              document.getElementById("editButton").style.display = "none";
            } else if ("out" == data) {
              document.getElementById("editButton").style.display = "";
            }
        }, error: function(error) {
          console.log(error);
        }
      });
    }*/
