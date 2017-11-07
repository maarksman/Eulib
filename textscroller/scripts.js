$(function(){
  console.log('yeah');
  $('.upArrow').click(showUpperDef);
  //$('.downArrow').click(showLowerDef);
  //$('.rightArrow').click(showRightDef);
  //$('.left').click(showLeftDef);
});


function showUpperDef() {

  $.get('/knowl1/horizontal/def1h.txt', function(data) {
    $('.knowl').load('<p>' + data + '</p>');
}, 'text');


}
