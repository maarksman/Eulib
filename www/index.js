const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io  = require('socket.io')(http);
const spawn = require('child_process').spawn;
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const crypto = require('crypto');
const moment = require('moment');
const fs = require('fs');

var username;
//set up pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//middlewares
app.use(cookieParser());
app.use(jsonParser);
//app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret: 'anything', saveUninitialized: true, resave: true}));

//for serving static files found in public folder
app.use(express.static('public'));


//create connection
var db = mysql.createConnection({
  host: 'localhost',
  user: 'prikshet',
  password: 'mysql',
  database: 'EulibDB',
	multipleStatements: true
});

//connect with database; if not connected throw error
db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('mysql connected');
});

//not sure if this is actually working?
app.get('/', (req, res) => {
  console.log("entered /");
  // return res.redirect('/dashboard');
  if(req.session.username==null){
    console.log("null")
    return res.sendFile(__dirname + '/public/index.html');
  }
  else{
    console.log(req.session.username);
    return res.redirect('/indexsignedin');
  }
});

//create db
app.get('/createdb2', (req, res)=>{
  let createtablesquery = ` drop table if exists article;
  drop table if exists users;
  drop table if exists field;
  drop table if exists user;
  drop table if exists bookmarks;
  drop trigger if exists bookdatetrigger;

  create table field(
  	field VARCHAR(30),
  	subfield_of VARCHAR(30),
  	PRIMARY KEY (field)
  );

  create table users(
  	username VARCHAR(50) PRIMARY KEY,
  	password VARCHAR(100) NOT NULL,
  	first_name VARCHAR(50) ,
  	last_name VARCHAR(50) ,
  	salt VARCHAR(50),
  	account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	theme TEXT,
  	email VARCHAR(50),
    UNIQUE (email)
  );

  create table article(
  	id INT PRIMARY KEY AUTO_INCREMENT,
  	title VARCHAR(30) NOT NULL,
  	type VARCHAR(30) NOT NULL,
    level INT,
    belongs_to VARCHAR(30),
  	FOREIGN KEY (belongs_to) REFERENCES field(field),
  	path VARCHAR(150) NOT NULL,
  	date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    creator VARCHAR(50),
    FOREIGN KEY (creator) REFERENCES users(username),
  	last_edited DATETIME ON UPDATE CURRENT_TIMESTAMP,
    last_editor VARCHAR(50)
  );

  create table bookmarks(
    bookid INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    title VARCHAR(30),
    field VARCHAR(30),
    last_edited DATETIME
  );

  INSERT INTO users (username, password, email) VALUES ('testuserpony', 'password', 'testuser1@eu.lib'),
  ('testuser2', 'password', 'Algebra@malgebra.com');

  INSERT INTO field VALUES ('Mathematics', NULL),
  ('Algebra', 'Mathematics'),
  ('Analysis', 'Mathematics'),
  ('Field Theory', 'Algebra');

  INSERT INTO article ( title, type, belongs_to, path, creator, level)
  VALUES ( 'Automorphism', 'Definition', 'Analysis', 'knowlcontent/automorphism.html', 'testuserpony', 3),
   ( 'Field', 'Definition', 'Mathematics', 'knowlcontent/field.html', 'testuserpony', 3),
   ( 'Field Extension', 'Definition', 'Field Theory', 'knowlcontent/fieldextension.html', 'testuserpony', 3),
   ( 'Galois Group', 'Definition', 'Algebra', 'knowlcontent/galoisgroup.html', 'testuserpony', 3)
   `;

    db.query(createtablesquery, (err, result) => {
      if(err) throw err;
      console.log(result);
  	});
    res.redirect('/')
});

// added a user with username 'first', password: 'first', theme: '0'
app.get('/adduser1', (req, res) => {
  let post = {username: 'first', password: 'first', theme: '0'};
  let sql = 'INSERT INTO users SET ?';
  let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('user added');
  });
});

//show the contents of the database
app.get('/show_db', (req, res) => {
  let sql = 'SELECT * FROM users';
  db.query(sql, (err, results, fields) =>{
    if(err) throw err;
    str = '';
    for(i=0;i<results.length;i++){
      str = str + results[i].username +"  " + results[i].password+ '\n';
    }
    console.log(str);
    res.send('showing users table in node console');
    // res.render('signedin', {
    //   name : 'cool guy'
    // });
  });
});


//create a new user
app.post('/create_user', urlencodedParser,(req, res) => {
  console.log("/create_user running");
  //using where username = ? and email = ? caused a syntax error using separate queries instead
  let userquery = "SELECT * FROM users WHERE username=?";
  let emailquery = "SELECT * FROM users WHERE email=?";

  var input_user = req.body['username'];
  var input_email = req.body['email'];
  //console.log("Making sure user doesn't already exist: "+input_user);
  //console.log(userquery);
  db.query(userquery, input_user, (err, result)=>{
    if(err)throw err;
    else{
      if(result.length==0){
        db.query(emailquery,input_email,(err,result)=>{
          if(err)throw err;
          else{
            if(result.length==0){
              //console.log("creating user");
              var salt = moment().format();
              const secret = req.body['password'];
              const hash = crypto.createHmac('sha256', secret)
                               .update(salt)
                               .digest('hex');
              let sql = 'INSERT INTO users SET ?';
              let post = {username: req.body['username'], password: hash, salt: salt,email: req.body['email']};
              let query = db.query(sql, post, (err, result) => {
                if(err) throw err;
                //console.log(result);
                //console.log("user created:"+input_user)
                res.redirect('/')
              });
            }
            else{
              //console.log("email taken");
              res.send('email taken');
            }
          }
        })
        }
        else{
          //console.log("usernametaken");
          res.send('username taken');
        }
    }
  });
  //res.redirect('/');
});

var usertheme;
//sign in user makes sure user exists then hashes input and check if it matches with db
app.post('/signin', urlencodedParser, (req, res) => {
  var username = req.body['username'];
  var password = req.body['password'];
  const secret = password;
  let sql = 'SELECT * FROM users WHERE username = ?';

  let query = db.query(sql,[username], (err, result)=> {
    if(err) throw err;
    if(result.length == 0){
      console.log('invalid username');
      res.send('invalid username');
    }
    else {
        //console.log("found: "+result.length+" results.")
        for(var i=0;i<result.length;i++){
          var row = result[i];
          var salt = row.salt;
          var hash = crypto.createHmac('sha256', secret)
                           .update(salt)
                           .digest('hex');
         if(hash==row.password){
           req.session.username = username;
           //console.log('req.session.username: '+req.session.username);
           usertheme= result[0].theme;
           //console.log('usertheme before redirecting to dashboard: ' + usertheme);
           res.send('/indexsignedin');
         }
         else{
          console.log("incorrect password");
          res.send('invalid password');
         }
        }
    }
  });
  //cookies
  console.log("==================cookies==================");
  console.log(req.cookies);
  console.log('==================session==================');
  console.log(req.session);
  console.log("=============sign-in complete==============");
});
//load indexsignedin.pug
app.get('/indexsignedin', (req,res) =>{
  //console.log('trying to print username' + req.session.username);
  var username = req.session.username;
  console.log("username: "+username);
  if(req.session.username == null) {
    res.redirect('/');
  } else {
    res.render('indexsignedin', {
      name: username,
    });
  }
});
//old signedin page?...delete?
app.get('/dashboard', (req, res) => {
  console.log("entered /dashboard");
  var username = req.session.username;
});

//old...delete?
app.post('/changeTheme', urlencodedParser, (req, res) => {
  var newTheme = req.body['theme'];
  usertheme = newTheme;
  console.log('change theme for: ' + req.session.username);
  let sql = 'UPDATE users SET theme = ? WHERE username = ?';
  let query = db.query(sql,[newTheme, req.session.username], (err, result) =>{
    if(err) throw err;
    console.log(result);
  });

  res.send('sent from changeTheme post' + req.session.username);
});


//remove session username will remove ability for user to view logged in pages
app.get('/signout', (req, res) => {
  console.log("Signing out user: "+req.session.username);
  req.session.username = undefined;
  return res.redirect('../');
});

app.post('/articlecreate', urlencodedParser, (req, res) =>{
  let belongs_to = req.body['field'];
  let title = req.body['title'];
  let type =req.body['type'];
  let level = req.body['level'];
  let creator = req.session.username;
  let content = "<div>"+ req.body['content']+ "</div>";
  let path = "knowlcontent/" + title + "_" + level + ".html";
  let filename = title + "_" + level + ".html"
  let contentpath = 'public/knowlcontent/' + filename;
  let checksql = "SELECT title FROM article where title ='" + title + "' AND level=" + level;
  let titlelevel_exists = false;
  db.query(checksql, (err,result) =>{
    if(err) throw err;
    else{
        if(result.length == 0){
          createsql = "INSERT INTO article (title, type, belongs_to, path, creator, level) VALUES ('"
                      + title + "','" + type + "','" + belongs_to + "','"
                      + path + "','" + creator + "','" + level + "')";
          console.log("Query is: " + createsql);
          db.query(createsql, (err, result) => {
            if(err){
              throw err;
            }
            res.end();
          });
          // use fs module to write new file to "knowlcontent"
          fs.writeFile(contentpath , content, function (err) {
            if (err) throw err;
            console.log('put content:' + content + 'in ' + contentpath);
          });
        }
        else {
          titlelevel_exists = true;
          console.log('title with level already exists');
          if (titlelevel_exists) {
            res.send("Title with level exists");
          }
        }
    }
  });

});
//edit an article... knowl plugin box stays in edit page.. can still be removed
//afterward so not a big issue
app.post('/updatearticle', urlencodedParser, (req,res)=>{
  if(req.session.username!=null){
    var title = req.body['search-text'];
    var path = req.body['path'];
    var content = req.body['content'];
    //console.log("title: "+title);
    //console.log("path: "+path);
    //console.log("content: "+content);
    //UPDATE [table] SET [column] = '[updated-value]' WHERE [column] = [value];
    let query = "UPDATE article SET last_editor = ? WHERE title = ?";
    db.query(query,[req.session.username,title],(err, result)=>{
      if(err)
        throw err;
      else{
        console.log("success");
      }
    })
    //console.log(typeof path);
    fs.writeFile("public\\"+path, "<div>"+content+"</div>", function(err){
      if(err) throw err;
      else{
        console.log("updated: "+path)
      }
    })
    res.send("updated");
  }
  else{
    //alternative to removing edit button on index.html but keeping in pug page.
    res.send("user not logged in, cannot edit");
  }
});
//populates search list options
app.post('/searcharticle', urlencodedParser, (req, res) => {
  var search = req.body['search-text'];
  let tosend = "";
  let sql = "SELECT * FROM article WHERE title LIKE '%" + search + "%' AND level=3";
  // console.log('sent in /searcharticle: '+ search);
  //console.log('querying: ' + sql);
  let query = db.query(sql, (err, result)=>{
    //console.log('did we get to query func?');
    if(err)
      throw err;
    else
      for (var i = 0; i < Math.min(result.length, 10); i++) {
          var row = result[i];
          //TODO alter to work with article fields.
          var title = row.title;
          var type = row.type;
          var path = row.path;
          let level = row.level;
          let display = title;
          // + "-" + type;
          let dlistelement = "<option data-path='" + path +  "' value='" + display + "'>"
          tosend = tosend + dlistelement
          //console.log("title: "+ title + " type: "+type);
          }
      //console.log('tosend is: ' + tosend);
      res.write(tosend);
      res.end();
    });
});
//loads articles,,called redir because it originally did redirect.
//sends html of article along with path id and a boolean to determine if it exists
//so that nonexistant articles wont break
app.post('/searcharticleredir', urlencodedParser, (req, res) => {
  var search = req.body['search-text'];
  let content;
  let sql = "SELECT * FROM article WHERE title =?";
  let isindatabase = false;
  let cangoright = false;
  let cangoleft = false;
  let rightid = "";
  let leftid = "";
  let query = db.query(sql, search,(err, result)=>{
    if(err)
      throw err;
    else
      //console.log(result.length);
      for (var i = 0; i < result.length; i++) {
          var row = result[i];
          if (row.level == '3') {
          var path = row.path;
          var id = row.id;
          isindatabase = true;
          }
          if (row.level == '2') {
            cangoleft = true;
            leftid = row.id;
          }
          if (row.level == '4') {
            cangoright = true;
            rightid = row.id
        }
      }
      if (isindatabase) {
      content = fs.readFileSync('public/' + path, 'utf8');
      var jsonobj = {"content": content, "path":path, "id":id, "articlefound":isindatabase,
                      "cangoleft": cangoleft, "cangoright": cangoright,
                    "rightid":rightid, "leftid":leftid};
      // query to check for left/right
      //console.log(jsonobj);
      var sendjson = JSON.stringify(jsonobj);
      }
      else {
        var jsonobj = {"articlefound":isindatabase};
        //console.log(jsonobj);
        var sendjson = JSON.stringify(jsonobj);
      }

      //console.log(sendjson);
      res.send(sendjson);


    });
});


app.get('/getfields', (req, res) => {
  var sentJSON = {"fields" : []};
  let sql = "SELECT DISTINCT belongs_to FROM article";
  let query = db.query(sql, (err, result)=>{
    if(err)
      throw err;
    else {
      for (var i = 0; i < result.length; i++) {
        sentJSON.fields[i] = result[i].belongs_to;

      }
      let formattedsentJSON = JSON.stringify(sentJSON);
      res.send(formattedsentJSON);
    }
  });


});
// THIS DOENS'T WORK YET
app.post('/makebookmark', urlencodedParser, (req, res) => {
  let bookinguser;
  if (req.session.username != null) {
    bookinguser = req.session.username;
  }
  let title = req.body['title'];
  //search for field and last edited using unique title
  let field;
  let fieldquery = "SELECT belongs_to from article WHERE title ='" + title + "'";
  let findfield = db.query(fieldquery, (err, result) =>{
    if (err)
      throw err;
    else {

    }
  });

  makesql = "INSERT INTO bookmarks (title, field, username) VALUES ('"
              + title + "','" + field + "','" + bookinguser + "')";
  let tosend = "<p>Bookmark not made :-(</p>"
  let query = db.query(makesql, (err, result)=>{
      if(err)
        throw err;
      else {
        let tosend = '<p>bookmark insert successful!</p>';
      }
  res.send(tosend);
  });
});
//sends articles for profile page. adds /n to split them at that point
app.get('/getuserarticles',urlencodedParser,(req,res)=>{
  let user=req.session.username;
  let query="SELECT * FROM article WHERE creator = ?";
  db.query(query,user,(err,result)=>{
    if(err)throw err;
    else{
      //console.log("len: "+result.length)
      for (var i = 0 ; i < result.length; i++) {
          var row = result[i];
          if(i<result.length-1){
            res.write(JSON.stringify(row) + "/n");
          }
          else{
            res.write(JSON.stringify(row));
          }
        }
        res.end()
    }
  });

});
//loads profile page
app.get('/signedin',(req,res)=>{
   var username=req.session.username;
   console.log("/signedin - profile page: "+ username);
   if(req.session.username==null){
    res.redirect('/');
  }
  else{
      res.render('newuserprofile',{
        name:username,
      });
  }
});
//deletes article from db and deletes html file
app.post('/deletearticle',urlencodedParser,(req,res)=>{
  let title = req.body['title'];
  console.log("deleting: "+title);
  db.query("select path from article where title =?",title,(err,result)=>{
    if(err)throw err;
    var row = result[0];
    var path = "public\\"+row.path;
    console.log("pathtype: "+ typeof path)
    console.log(path);
    fs.unlink(path,(err)=>{
      if(err) throw err;
      console.log("succssfully deleted: "+path);
    });
  });
  let query = "DELETE FROM article WHERE title = ?";
  db.query(query,title,(err,result)=>{
    if(err) throw err;
    else{
      res.send("removed "+path+"from db");
    }
  });
});

app.post('/arrowcontent',urlencodedParser, (req, res)=> {

});

http.listen(3000, function(){
  console.log('listening on :3000')
});
