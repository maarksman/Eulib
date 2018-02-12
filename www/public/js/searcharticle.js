var textarea = $('#mEdit');
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
    search($('#search'), $('#articles')) ;
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

//renders article from searchbox to page
function redir($inputid){
    var my_search = ($inputid.val());
    //option[value='"+ my_search + "']"
    let alistoption = $("#articles option[value='" + my_search + "']");
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
            alert('"'+ my_search + '" not in database, please try again');
          }
          else {
          var div = $(
          "<div id='adding'" +
          " data-id=" + myObj.id + " data-level='3'" + "> \
          <button class=\"editerB "+myObj.id+  "\"type=\"button\">Edit</button>\
          <button onclick=\"removeDiv(this)\" type=\"button\">X</button>\
          <div class ="+myObj.id+" style=\"display:none;\"><textarea style=\"width:100%;height:220px;\"></textarea></div>"
          + `<button class="leftbutton button" data-id=""> < </button>
          <button class="rightbutton button" data-id=""> > </button>`
          + "<div class='knowlcontent1'>" + myObj.content + "</div>" +
          "</div>");

          //$('#articles-searched').prepend(div.addClass("boxed"));
          $('#entry-content').prepend(div.addClass("boxedin"));
          if (!myObj.cangoleft) {
            $('#adding').children('.leftbutton').hide();
          } else {$('#adding').children('.leftbutton').attr('data-id', myObj.leftid);}
          if (!myObj.cangoright) {
            $('#adding').children('.rightbutton').hide();
          } else {$('#adding').children('.rightbutton').attr('data-id', myObj.rightid);}
          //remove the marker of nowl we just added
          $('#adding').removeAttr('id');
          }
      },
      error: function(error) {
        console.log(error);
      }
    });
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
            alert("Article not in database, please try again");
          }
          else {
            for (i=0;i<myObj.numtorender;i++) {
              var div = $(
              "<div id='adding'" +
              " data-id=" + myObj.id + " data-level='3'" + "> \
              <button class=\"editerB "+myObj.id+  "\"type=\"button\">Edit</button>\
              <button onclick=\"removeDiv(this)\" type=\"button\">X</button>\
              <div class ="+myObj.id+" style=\"display:none;\"><textarea style=\"width:100%;height:220px;\"></textarea></div>"
              + `<button class="leftbutton button" data-id=""> < </button>
              <button class="rightbutton button" data-id=""> > </button>`
              + "<div class='knowlcontent1'>" + myObj.knowlinfo[i].content + "</div>" +
              "</div>");

              //$('#articles-searched').prepend(div.addClass("boxed"));
              $('#entry-content').prepend(div.addClass("boxedin"));
              if (!myObj.cangoleft) {
                $('#adding').children('.leftbutton').hide();
              } else {$('#adding').children('.leftbutton').attr('data-id', myObj.leftid);}
              if (!myObj.cangoright) {
                $('#adding').children('.rightbutton').hide();
              } else {$('#adding').children('.rightbutton').attr('data-id', myObj.rightid);}
              //remove the marker of nowl we just added
              $('#adding').removeAttr('id');
            }
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
