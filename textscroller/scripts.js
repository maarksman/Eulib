$(function(){
  console.log('yeah');
  $('.upArrow').click(showUpperDef);
  //$('.downArrow').click(showLowerDef);
  //$('.rightArrow').click(showRightDef);
  //$('.left').click(showL  eftDef);
});


function showUpperDef() {
  console.log('do we come here?');
//   $.get('/knowl1/horizontal/def1h.txt', function(data) {
//     $('.knowl').load('<p>' + data + '</p>');
// }, 'text');

$.get('linkedfile3.html');


}
