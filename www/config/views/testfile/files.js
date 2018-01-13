var fs=require('fs');
fs.readFile('data.txt', function(err,data){
  if(err) throw err;

  var text = data.toString();
  console.log(text);

  var lines = text.split('\n');

  var dictionary ={}

  lines.forEach(function (line){
    console.log("a line: "+line);

    var words = line.split(' ');

    var letter = words[0];
    var number = words[1];
    if(!dictionary[letter]){
      dictionary[letter]=0;
    }
    dictionary[letter] +=parseInt(number);
  });
  console.log(dictionary);
  //look into database info?
});
