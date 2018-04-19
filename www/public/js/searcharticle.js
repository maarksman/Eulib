function validchar(validstr, tocheck) {
  for (i=0; i<tocheck.length; i++) {
    if (!( validstr.includes(tocheck[i]) )) {
      return false;
    }
  }
  return true;
}

const lowerchars = "abcdefghijklmnopqrstuvwxyz";
const allowedchars = lowerchars + "-() " + lowerchars.toUpperCase() + "0123456789";

function badtitle(titletext) {
  if (validchar(allowedchars, titletext)) {
    return false;
  }
  return true;
}

function isYoutubelink(link) {
  var matches = link.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
  return matches;
}

//needed to get the datalist in edit to work
var globaleditcounter = 0;
var text;
var title;
var path;
$(document).ready(function() {
  //load_js();
  console.log('searcharticlelive');

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
        $('#changing').removeAttr('id');
      },
      error: function(error) {
        console.log(error);
        $('#changing').removeAttr('id');
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
  });

  $('.close').on('click',function(){
    console.log("close clicked")
  });

  $('#addlink').on('keyup', function(e){
    //clear original datalist
    $('#linkstoadd').html("");
    search($('#addlink'), $('#linkstoadd'));
  });

  $('#editing .editAddLink').on("select", function() {
        console.log("edit add link pressed");
  });

  //editsearchbar links
  $('input.editAddLink').on('keyup', function(e){
    console.log('did we change editbar?');
    //clear original datalist
    $('#editlinks').html("");
    //get current search value
    let cursearch = $('#editlinks').val()
    //use "badtitle' function from articlecreate file to check chars"
    if (badtitle(cursearch) || cursearch.length > 50) {
      $('div#editing input.editAddLink').css("border", "solid 2px");
      $('div#editing input.editAddLink').css('border-color', 'red');
    } else {
      $('div#editing input.editAddLink').css("border", "none");
      $('div#editing input.editAddLink').css('border-color', 'white');
      search($('div#editing input.editAddLink'), $('#editlinks')) ;
    }
  });

//rewrite whole edit to restrict to single knowl
  $(document).on('click','.editerB', function() {


    let editingknowlclicked = (this.closest('#editing') != null);
    if ($('#editing').length > 0) {
      if (editingknowlclicked) {
      console.log('clicked edit of current knowl');
      //change content based on frontend elements
      let newcontent;
      if ($('div#editing div.knowlcontent1 p').length) {
        let editedhtml = $('div#editing textarea.editContent').val();
        $('div#editing div.knowlcontent1 p').html(editedhtml);
        newcontent = $('div#editing div.knowlcontent1').html();

      } else if ( ($('div#editing div.knowlcontent1 iframe').length != null) ) {
        let youtubelink = $('div#editing textarea.editContent').val().trim();
        if (isYoutubelink(youtubelink)) {
          alert('Note new url does not udate video');
          newcontent = youtubelink;
        } else {
          alert('invalid link!');
          newcontent = $('div#editing div.knowlcontent1 iframe').attr('src');
        }

      } else {
        newcontent = $('div#editing textarea.editContent').val();
        $('div#editing div.knowlcontent1').html(newcontent);
      }
      let editingid = $('div#editing').attr('data-id');
      //if type is video, content is link ONLY, not frame. link needsformatting
      saveArticle(editingid, newcontent);
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, $('#editing .knowlcontent1').get(0)]);

      $('#editing').children().show();
      $('#editing').children('.editmode').hide();
      //show buttons that have links
      $('#editing button.button').hide();
      $('#editing button.showbutton').show();
      $('#editing button.editerB').html("Edit");
      $('#editing').removeAttr('id');
      //$('#editlinks').removeAttr('id');
      } else {
        alert('Edit already in progress');
      }
    } else {
      //mark knowl for editing and input + datalist for adding
      $(this).closest('[data-id]').attr('id', 'editing');
      //$('div#editing datalist').attr('id', 'editlinks');
      //$('div#editing input.editAddLink').attr('list', 'editlinks');
      //marked knowl under edit, show all elements for editing and hide the rest
      $('#editing').children().hide();
      $('#editing').children('.knowlheader,.editmode').show();
      $('#editing button.editerB').html("Save");
      //remove knowls if added
      $('div#editing div.knowl-output').remove();
      //mark the buttons if present
      $("div#editing button:visible").addClass('showbutton');
      let texttoedit = $('div#editing p').html();
      console.log('texttoedit is:', texttoedit);

      //$('div#editing textarea').val(texttoedit);

    }

  });

  $(document).on('click','div#editing button.addLinkButton', function() {
    console.log("TESTING");
    var selStart = $('#editing textarea.editContent').prop('selectionStart');
    var selEnd = $('#editing textarea.editContent').prop('selectionEnd');
    var text = $('#editing textarea.editContent').val();
    var title = $('#editing input.editAddLink').val();
    let id = $("div#editing option[value='" + title + "']").attr('data-id');
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
      if (path == 'undefined' || path == undefined) {
        alert('invalid edit path');
        $('#editing .editLinkMessage').text("Link invalid/path data not gotten");
      } else if (selStart === selEnd) {
        //if no highlight add to end
        let snippet = '<a knowl= "' + path + '">Text to link here</a>';
        text = text + snippet;
        $('#editing .editLinkMessage').text('Link added successfully');
        $('#editing .editContent').val(text);
      } else {
        //if highlighted
        var selText = $('#editing .editContent')
        .val()
        .substring(selStart, selEnd);
        let snippet =
        '<a knowl= "' + path + '">' + selText + '</a>';
        var start = text.substring(0, selStart);
        var end = text.substring(selEnd, text.length);
        text = start + snippet + end;
        $('#editing .editLinkMessage').text('Link added successfully');
        $('#editing .editContent').val(text);
      }


    },
    error: function(error) {
      console.log(error);
    }
  });
  });
});

  function saveArticle($inputid, $inputcontent){
    // if knowl if a youtube vid, content is link only, else content is html
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
      let my_search = ($inputid.val());
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
                //generate unique id for editing
                let editnum = globaleditcounter.toString();
                globaleditcounter = globaleditcounter + 1;
                //add unique id to datalist
                var div = $(
                  "<div id='adding'" + " data-id=" + myObj.id + "> \
                   <div class='knowlheader border border-dark'><span class='knowltitle'>"+myObj.title+" - Level "+myObj.level+"</span>\
                   <button class=\"editerB editButton editmode "+myObj.id+  " knowl-button " + "\"type=\"button\" style='display:"+style+";'>Edit</button>\
                  <button class=\" knowl-button \"  onclick=\"removeDiv(this)\" type=\"button\">X</button></div>\
                   <div class='addLinkOptions editmode' style='display: none'>\
                   <span class='editmode'>Add Knowl Link</span>\
                   <input onkeyup='editsuggest(this)' class='editAddLink editmode' list='editlist" + editnum + "' name='titlelist' data-editid=" + editnum + ">\
                  <br><datalist class='editlinkstoadd editmode' id='editlist" + editnum + "'></datalist>\
                  <button class=\" addLinkButton editmode \" style=\"\" type=\"button\">Add Link</button>\
                  </div>\
                  <div class =\"editbox editmode\" style=\"display:none;\">  <textarea style=\"width:100%;height:220px;\" class='editContent editmode'></textarea></div>"
                  + `<button class="leftbutton button" data-id=""> < </button>
                  <button class="rightbutton button" data-id=""> > </button>`
                  + "<div class='knowlcontent1'>" + myObj.content + "</div>" +
                  "<div class='knowlfooter border border-dark'>" +
                  "<a href=''>link 1 </a>" +  "<a href=''>link 2 </a>" +  "<a href=''>link 3</a>" +
                  "</div>"+
                  "</div>");

              //$('#articles-searched').prepend(div.addClass("boxed"));
              $('#entry-content').prepend(div.addClass("boxedin"));
              if (!myObj.cangoleft) {
                $('#adding').children('.leftbutton').hide();
              } else {$('#adding').children('.leftbutton').attr('data-id', myObj.leftid);}
              if (!myObj.cangoright) {
                $('#adding').children('.rightbutton').hide();
              } else {$('#adding').children('.rightbutton').attr('data-id', myObj.rightid);}
              if (myObj.type == "TextKnowl") {
                let edittext = $('div#adding div.knowlcontent1 p').html();
                $('div#adding textarea.editContent').html(edittext);
                console.log('Textknowl edittext is: ', edittext);
              } else if (myObj.type == "Video") {
                let edittext = $('div#adding iframe').attr('src');
                $('div#adding textarea.editContent').html(edittext);
                console.log('video edittext is: ', edittext);
              } else {
                let edittext = $('div#adding div.knowlcontent1 div').html();
                $('div#adding textarea.editContent').html(edittext);
                console.log('last edittext is: ', edittext);
              }
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
      } else if ($datalist.children().length == 1) {
        //lazy fix- change search o suggestiong and clear after
        alert('Use single search button for one suggestion');
        /*
        let originaltext = $('#search');
        let newtext = $search().attr('value');
        $('#search').val(newtext);
        redir($('#search'));
        $('#search').val(originaltext);
        */
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
                  let editnum = globaleditcounter.toString();
                  globaleditcounter = globaleditcounter + 1;
                  //add unique id to datalist
                  var div = $(
                    "<div id='adding'" + " data-id=" + curknowl.id + "> \
                     <div class='knowlheader border border-dark'><span class='knowltitle'>"+curknowl.title+" - Level "+curknowl.level+"</span>\
                     <button class=\"editerB editButton editmode "+curknowl.id+  " knowl-button " + "\"type=\"button\" style='display:"+style+";'>Edit</button>\
                    <button class=\" knowl-button \"  onclick=\"removeDiv(this)\" type=\"button\">X</button></div>\
                     <div class='addLinkOptions editmode' style='display: none'>\
                     <span class='editmode'>Add Knowl Link</span>\
                     <input onkeyup='editsuggest(this)' class='editAddLink editmode' list='editlist" + editnum + "' name='titlelist' data-editid=" + editnum + ">\
                    <br><datalist class='editlinkstoadd editmode' id='editlist" + editnum + "'></datalist>\
                    <button class=\" addLinkButton editmode \" style=\"\" type=\"button\">Add Link</button>\
                    </div>\
                    <div class =\"editbox editmode\" style=\"display:none;\">  <textarea style=\"width:100%;height:220px;\" class='editContent editmode'></textarea></div>"
                    + `<button class="leftbutton button" data-id=""> < </button>
                    <button class="rightbutton button" data-id=""> > </button>`
                    + "<div class='knowlcontent1'>" + curknowl.content + "</div>" +
                    "<div class='knowlfooter border border-dark'>" +
                    "<a href=''>link 1 </a>" +  "<a href=''>link 2 </a>" +  "<a href=''>link 3</a>" +
                    "</div>"+
                    "</div>");
                  //$('#articles-searched').prepend(div.addClass("boxed"));
                  $('#entry-content').prepend(div.addClass("boxedin"));
                  if (!curknowl.cangoleft) {
                    $('#adding').children('.leftbutton').hide();
                  } else {$('#adding').children('.leftbutton').attr('data-id', curknowl.leftid);}
                  if (!curknowl.cangoright) {
                    $('#adding').children('.rightbutton').hide();
                  } else {$('#adding').children('.rightbutton').attr('data-id', curknowl.rightid);}
                  //put relevent text in edit box
                  if (curknowl.type == "TextKnowl") {
                    let edittext = $('div#adding div.knowlcontent1 p').html();
                    $('div#adding textarea.editContent').html(edittext);
                  } else if (curknowl.type == "Video") {
                    let edittext = $('div#adding iframe').attr('src');
                    $('div#adding textarea.editContent').html(edittext)
                  } else {
                    let edittext = $('div#adding div.knowlcontent1 div');
                    $('div#adding textarea.editContent').html(edittext);
                  }

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

    //global function for edit datalist processing

  function editsuggest(element) {
    //attribute is on the input
    let editid = $(element).attr('data-editid');
    let editlistid = "editlist" + editid;
    let editlistselector = '#' + editlistid;
    //get the links
    console.log('did we change editbar?');
    //clear original datalist
    $(editlistselector).html("");
    //get current search value
    let cursearch = $(element).val()
    //use "badtitle' function from articlecreate file to check chars"
    if (badtitle(cursearch) || cursearch.length > 50) {
      $('div#editing input.editAddLink').css("border", "solid 2px");
      $('div#editing input.editAddLink').css('border-color', 'red');
    } else {
      $('div#editing input.editAddLink').css("border", "none");
      $('div#editing input.editAddLink').css('border-color', 'white');
      search($(element), $(editlistselector)) ;
    }
  }

  function removeDiv(element){
    $(element).closest("div.boxedin").remove();
  }

  function clearAllKnowls() {
    $('#entry-content').empty();
  }
