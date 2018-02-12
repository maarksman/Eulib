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
//create connection
var db = mysql.createConnection({
  host: 'localhost',
  user: 'eulibdbuser',
  password: 'mysql',
  database: 'EulibDB',
  multipleStatements: true
});
require('./config/setuse')(app, bodyParser);
require('./routes/database')(app, db);
require('./routes/search')(app, urlencodedParser, db, fs); // <-- do this to add a file. In the parenthes put all the requires that you'll be using in that collection of routes. Look at ./routes/search.js to know more.
require('./routes/user')(app, urlencodedParser, db);
require('./routes/navigation')(app, urlencodedParser, db, fs);
require('./routes/eulibs')(app, urlencodedParser, db, fs);
require('./routes/bookmarks')(app, urlencodedParser, db);
require('./routes/loginout')(app);
require('./routes/aesthetics')(app, urlencodedParser, db);

http.listen(3000, function() {
  console.log('listening on :3000');
});
