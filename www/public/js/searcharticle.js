var textarea = $('#mEdit');
var text;
var title;
var path;
var knowl = $('.knowl-content loading');
$(document).ready(function() {
  //load_js();
  console.log('searcharticlelive');

  //function for article left-right
  $(document).on('click', '.button', function(e){
    //add changing id to remove later
    console.log('Registered click');
    $(this).closest(".boxedin").attr("id", 'changing');
    let newpath = $(this).attr('data-path');
    let prevpath = $('#changing').attr('data-path');
    let level = $('#changing').attr('data-level');
    console.log('prev knowl data-path is: '+ prevpath);
    console.log('new knowl data-path is: '+ newpath);
    let leftorright = $(this).hasClass('leftbutton') ? 'left' : 'right';
    //get content, remove content div then add new content

    $.ajax({
      url: '/arrowcontent',
      data: {'pathin': newpath, 'curlevel':level, 'leftorright':leftorright},
      type: 'POST',
      datatype: 'json',
      success: function(data) {
        //console.log('data came back as: ' + data);
        console.log("Fired arrowcontentchange request");
        let myobj = JSON.parse(data);
        $("#changing").children().remove('.knowlcontent1');
        let newdiv = $("<div class='knowlcontent1'>" + myobj.content + "</div>");
        /*console.log('returned content is:');
        console.log(myobj.content); */
        console.log('showing returned json');
        console.log(myobj);
        $('#changing').append(newdiv);
        //console.log('checking button changeup');
        //console.log($(this).hasClass('leftbutton'));
        if (leftorright == 'left') {
          $('#changing').children('.rightbutton').attr('data-path', prevpath);
          $('#changing').attr('data-path', newpath);
          $('#changing').attr('data-level', (parseInt(level)-1).toString());
          $('#changing').children('.rightbutton').show();
          if (myobj.lastleft || (level == '2') ) {
            $('#changing').children('.leftbutton').hide();
          }
          else {
            $('#changing').children('.leftbutton').attr('data-path', myobj.newpath);
            $('#changing').children('.leftbutton').show();
          }
        }
        if (leftorright == 'right') {
          $('#changing').children('.leftbutton').attr('data-path', prevpath);
          $('#changing').attr('data-path', newpath);
          $('#changing').attr('data-level', (parseInt(level)+ 1).toString());
          $('#changing').children('.leftbutton').show();
          if (myobj.lastright || (level == '4')) {
            $('#changing').children('.rightbutton').hide();
          }
          else {
            $('#changing').children('.rightbutton').attr('data-path', myobj.newpath);
            $('#changing').children('.rightbutton').show();
          }
        }

        $(this).parent().removeAttr('id');

      },
      error: function(error) {
        console.log(error);
      }
    });

  });


  $('#search').on('keyup', function(e){
    //clear original datalist
    $('#articles').html("");
    search($('#search'), $('#articles')) ;
  });

  $('#search_button').on("click",function(e){
    redir($('#search'));
  });
  $('.close').on('click',function(){
    console.log("close clicked")
  });

  $('#addlink').on('keyup', function(e){
    //clear original datalist
    $('#linkstoadd').html("");
    search($('#addlink'), $('#linkstoadd'));
  });

  $(document).on('click','.editerB', function() {
    //console.log("edit");
    //id is put into div covering entire article and into another div which holds the text area
    //grab the id from outer div
    textid= $(this).attr("class").split(" ")[1];
    //grab the div containing the textarea based on the id
    //<div><textarea></ta></div>
    textarea=$(this).closest("div").children("#"+textid);
    //grabs the parent of editerB and finds the last div which is the text of the article
    text=$(this).closest("div").children("div:last");

    title = $(this).closest("div").attr("data-title");
    path = $(this).closest("div").attr("data-path");
    if($(textarea).css("display")=="none"){
      //console.log("show");
      $(textarea).css("display","block");
      $(textarea).children("textarea").val(text.html());
      $(text).css("display","none");
      $(this).text("Save");
    }else{
      //console.log("hide+save");
      $(textarea).css("display","none");
      $(text).css("display","block");
      saveArticle(title,textarea.children("textarea").val(),path);
      $(this).text("Edit");
    }
  });
});
function saveArticle($inputtitle,$inputcontent, $inputpath){
  var my_search = ($inputtitle);
  var my_content = ($inputcontent);
  var my_path = ($inputpath);
  //console.log(my_search);
  //console.log(my_content);
  $.ajax({
    url: '/updatearticle',
    data: {'search-text': my_search, "content":my_content, "path":my_path},
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
  //clear original datalist

    //TODO sql search for articles including text
    var my_search = ($inputid.val());

    //console.log('starting ajax now');
    //console.log("searching for: "+my_search);
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

function redir($inputid){
    var my_search = ($inputid.val());
    let alistoption = $("#articles option[value='"+ my_search + "']");

        $.ajax({
        url: '/searcharticleredir',
        data: {'search-text': my_search},
        type: 'POST',
        datatype: 'json',
        success: function(data) {
          //console.log('received json of: ' + data);
          myObj = JSON.parse(data);
          //console.log(data);
          //<button onclick=\"bookmarkDiv(this)\" type=\"button\">Bookmark</button>\
          if (!myObj.articlefound) {
            alert("Article not in database, please try again");
          }
          else {
          var div = $(
          "<div id='adding' data-title=" + my_search +
          " data-path=" + myObj.path + " data-level='3'" + "> \
          <button class=\"editerB "+myObj.id+  "\"type=\"button\">Edit</button>\
          <button onclick=\"removeDiv(this)\" type=\"button\">X</button>\
          <div id="+myObj.id+" style=\"display:none;\"><textarea style=\"width:100%;height:220px;\"></textarea></div>"
          + `<button class="leftbutton button" data-path=""> < </button>
          <button class="rightbutton button" data-path=""> > </button>`
          + "<div class='knowlcontent1'>" + myObj.content + "</div>" +
          "</div>");

          //$('#articles-searched').prepend(div.addClass("boxed"));
          $('#entry-content').prepend(div.addClass("boxedin"));
          if (!myObj.cangoleft) {
            $('#adding').children('.leftbutton').hide();
          } else {$('#adding').children('.leftbutton').attr('data-path', myObj.leftpath);}
          if (!myObj.cangoright) {
            $('#adding').children('.rightbutton').hide();
          } else {$('#adding').children('.rightbutton').attr('data-path', myObj.rightpath);}
          //remove the marker of nowl we just added
          $('#adding').removeAttr('id');
          }
      },
      error: function(error) {
        console.log(error);
      }
    });


}

function removeDiv(element){
  $(element).closest("div").remove();
}
