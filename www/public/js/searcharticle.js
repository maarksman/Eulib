/*function load_js()
{
var head= document.getElementsByTagName('head')[0];
var script= document.createElement('script');
script.type= 'text/javascript';
script.src= 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML';
head.prepend(script);
}*/

var textarea = $('#mEdit');
var text;
var title;
var path
var knowl = $('.knowl-content loading')
$(document).ready(function() {
  //load_js();
  console.log('searcharticlelive');
  //if user clicks the the button with id change_theme, run change_theme function

  $('#search').on('keyup', function(e){
    //clear original datalist
    $('#articles').html("");
    search($('#search'), $('#articles')) ;
  });

  $('#search_button').on("click",function(e){
    //load_js();
    //console.log("clicked");
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
    // console.log("title: "+title);
    // console.log("textarea: " + textarea.html());
    // console.log("text: "+text.html());
    //knowl = $(".knowl-output");
    //console.log(knowl.html());
    //toggle save/edit button show/hide textarea/text
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
     //alert("test"); });
  //on click, get path and append to element
  /*
  $('#addknowlbutton').on('click', function(e){
    console.log('copypastelinkclicked');
    $('#copypastelink').html("");
    let linktitle = $('#addlink').val();
    let tofind = "[value=" + linktitle + "]";
    let knowl_path = $(tofind).attr('data-path');
    console.log('knowl path is ' + knowl_path);

  });*/
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
    // var d = new Date();
    // var month = d.getMonth()+1;
    // var day = d.getDate();
    // var output = d.getFullYear() + '/' +
    // (month<10 ? '0' : '') + month + '/' +
    // (day<10 ? '0' : '') + day;
    //console.log("search for: "+my_search);
    //search for existing option in articles datalist
    let alistoption = $("#articles option[value='"+ my_search + "']");
    //console.log('alistopiton');
    //console.log(alistoption);

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
          "<div data-title=" + my_search +
          " data-path=" + myObj.path +  "> \
          <button class=\"editerB "+myObj.id+  "\"type=\"button\">Edit</button>\
          <button onclick=\"removeDiv(this)\" type=\"button\">X</button>\
          <div id="+myObj.id+" style=\"display:none;\"><textarea style=\"width:100%;height:220px;\"></textarea></div>"
          +myObj.content+
          "</div>");
          //$('#articles-searched').prepend(div.addClass("boxed"));
          $('#entry-content').prepend(div.addClass("boxedin"));
          //textarea=$('#mEdit');
          }
          // $('#date').html(output);
          // $('#my_title').html(my_search);
          //window.location = data;

          //console.log('div:' + div);
          //onclick=\"editDiv(this)\"
      },
      error: function(error) {
        console.log(error);
      }
    });


}

function removeDiv(element){
  $(element).closest("div").remove();
}
// function editDiv(element){
//   $(element).text("Save");
//   var divhtml = $(element).closest("div").children("div").html();
//   var div = $(element).closest("div").children("div");
//   var outerdiv = $(element).closest("div");
//   div.hide();
//   $(".mEdit").css("display:block")
//   //console.log(divtext);
// }

//remove all
//$('div').remove(".boxedin")

// get datalist element
// onkeyup, update datalist function
// function - do db query, append all ound to listen
// if found, add option + value to dropdowns
// end function
