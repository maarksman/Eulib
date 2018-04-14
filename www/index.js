const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const spawn = require('child_process').spawn;
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const morgan = require('morgan');
const fs = require('fs');
const mysql = require('mysql');
var username;
var usertheme;
const asynceach = require('async-foreach');
const mathjax = require('mathjax-node');
const formidable = require('formidable');
const sharp = require('sharp');
const youtubevideoid = require('youtube-video-id');

//create connection
var db = mysql.createConnection({
  host: 'localhost',
  user: 'eulibdbuser',
  password: 'mysql',
  database: 'EulibDB',
  multipleStatements: true
});

//set mathjax global options for eqn processing
mathjax.config({
  MathJax: {
    tex2jax: {
      inlineMath: [['$', '$'], ["\\\\(", "\\\\)"]],
      displayMath: [['$$', '$$']],
      processEscapes: true
    }
  }
});

mathjax.start();

require('./config/setuse')(app, bodyParser);
require('./routes/database')(app, db, urlencodedParser);
require('./routes/search')(app, urlencodedParser, db, fs, asynceach, mathjax); // <-- do this to add a file. In the parenthes put all the requires that you'll be using in that collection of routes. Look at ./routes/search.js to know more.
require('./routes/user')(app, urlencodedParser, db);
require('./routes/navigation')(app, urlencodedParser, db, fs);
require('./routes/eulibs')(app, urlencodedParser, db, fs, formidable, sharp, youtubevideoid);
require('./routes/bookmarks')(app, urlencodedParser, db);
require('./routes/loginout')(app);
require('./routes/aesthetics')(app, urlencodedParser, db);

http.listen(3000, function() {
  console.log('listening on :3000');
});
