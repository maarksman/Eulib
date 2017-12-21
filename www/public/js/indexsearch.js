$(document).ready(function() {
  $("#search").on('keyup',function(){
    search($("#search"),$("#testdest"));
  })
});

function search($inputid, $target){
    //TODO sql search for articles including text
    var my_search = ($inputid.val())
    //console.log("searching for: "+my_search);
     $.ajax({
       url: '/search',
       data: {'search-text': my_search},
       type: 'POST',
       success: function(data) {
         $target.text(data);
       },
       error: function(error) {
         console.log(error);
       }
     });
}
