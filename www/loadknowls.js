/*Script which takes id of knowl links and populates with content */

var knowl_elements = document.getElementsByClassName("internal");
var id_list = [];
for (i = 0; i < knowl_elements.length; i++) {
  id_list.push(knowl_elements[i].getAttribute("id"));
  console.log(id_list[i]);
}
