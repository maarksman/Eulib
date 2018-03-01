//used in profile page after login.
//base table is full of placeholder data so remove all data and repopulate with ajax
$(document).ready(function() {
  console.log("loaduserarticles.js")
  loaduserarticles();
});
function loaduserarticles(){
  //console.log("loadingarticles")
  //empty table first
  $('#createdarticles').find("tr:gt(0)").remove();
  $.ajax({
    url:'/getuserarticles',
    data:{},
    type:'GET',
    success: function(data){
    //  console.log(JSON.stringify(data))
      var lines = data.split("/n")
      //console.log("data:"+data);
      //console.log("length:"+data.length);
      if(data.length>0){//cleans up a small error that pops up if no articles exist for user
        for (var i in lines) {
          console.log(i)
          var obj = JSON.parse(lines[i]);
          var id = obj.id;
          var title = obj.title
          var title = obj.title;
          var field = obj.belongs_to;
          var last_rev = obj.last_edited;
          var markup = "<tr><td>" + id + "</td><td>"
          +title+"</td><td>"
          + field
          + "</td><td>"
          + last_rev + "</td>"
          +"<td><button onclick=\"deletearticle(this)\"><i id= \"delete\"class=\"material-icons position-button\">delete</td>"
          +"<td></td></tr>";

          $('#createdarticles').append(markup);
        }
      }
    },
    error: function(error){{
      console.log(error);
    }}
  });
}
//delete article from database and html file, reload articles to update.
function deletearticle(element){
  //gets first parent row which is the one that holds button. finds the first data cell which holds title
  var title = $(element).closest("tr").find("td:eq(0)").text();
  $.ajax({
    url:"/deletearticle",
    data:{title:title},
    type:'POST',
    datatype:'html',
    success: function(data){
      console.log(data);
      loaduserarticles();
    },
    error: function(error){
      console.log(error);
    }
  });
}
