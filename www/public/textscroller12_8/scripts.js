

$(document).ready(function(){

  function getcontent(datapath) {
    let toreturn = "<p>We got nothing!</p>";
    $.ajax({
      url: '/arrowcontent',
      data: {'pathin': datapath},
      type: 'POST',
      datatype: 'html',
      success: function(data) {
        console.log('data came back as: ' + data);
        toreturn = data;
        //clear original datalist of children
        //parse data of title and infotyp
        // apppedchild to datalist
        console.log('returning: ' + toreturn);
        return toreturn;
      },
      error: function(error) {
        console.log(error);
      }
    });


  }

  $(".button").on('click', function(e){
    //add changing id to remove later
    $(this).closest(".knowl").attr("id", 'changing');
    let newpath = $(this).attr('data-path');
    let prevpath = $('#changing').attr('data-path');
    console.log('prev knowl data-path is: '+ prevpath);
    console.log('new knowl data-path is: '+ newpath);
    let isleftbutton = $(this).hasClass('leftbutton') ? true : false;
    let isrightbutton = $(this).hasClass('rightbutton') ? true : false;
    //get content, remove content div then add new content
    function isfinal(thepath) {
      if ((thepath == 'rightfile2.html') || (thepath == 'leftfile2.html')) {
        return true;
      }
      return false;
    }

    $.ajax({
      url: '/arrowcontent',
      data: {'pathin': newpath},
      type: 'POST',
      datatype: 'html',
      success: function(data) {
        //console.log('data came back as: ' + data);

        $("#changing").children().remove('.knowlcontent1');
        $('#changing').append(data);
        //console.log('checking button changeup');
        //console.log($(this).hasClass('leftbutton'));
        if (isleftbutton) {
          $('#changing').children('.rightbutton').attr('data-path', prevpath);
          $('#changing').attr('data-path', newpath);
          $('#changing').children('.leftbutton').hide();
        }
        if (isrightbutton) {
          $('#changing').children('.leftbutton').attr('data-path', prevpath);
          $('#changing').attr('data-path', newpath);
          $('#changing').children('.rightbutton').hide();
        }

        $(this).parent().removeAttr('id');

      },
      error: function(error) {
        console.log(error);
      }
    });

  });

});
