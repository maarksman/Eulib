var requires = ('express');

app = express();

app.get('/', function(req, res){
  res.send('you got!');
});
app.post('/',function(req, res){
  res.send('posted to /');
});
app.put('/put-test',function(req,res){
  res.send('put');
});
app.delete('/del-test',function(req,res){
  res.send('deleted');
});

app.listen(9090, function(){
  console.log("listening on 9090");
});
//curl -x
