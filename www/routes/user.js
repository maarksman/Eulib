const moment = require('moment');
const crypto = require('crypto');
module.exports = (app, urlencodedParser, db) => {
  //sends articles for profile page. adds /n to split them at that point
  app.get('/getuserarticles', urlencodedParser, (req, res) => {
    let user = req.session.username;
    let query = 'SELECT * FROM article WHERE creator = ?';
    db.query(query, user, (err, result) => {
      if (err) throw err;
      else {
        //console.log("len: "+result.length)
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          if (i < result.length - 1) {
            res.write(JSON.stringify(row) + '/n');
          } else {
            res.write(JSON.stringify(row));
          }
        }
        res.end();
      }
    });
  });
  // added a user with username 'first', password: 'first', theme: '0'
  app.get('/adduser1', (req, res) => {
    let post = { username: 'first', password: 'first', theme: '0' };
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, post, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send('user added');
    });
  });

  //create a new user
  app.post('/create_user', urlencodedParser, (req, res) => {
    console.log('/create_user running');
    //using where username = ? and email = ? caused a syntax error using separate queries instead
    let userquery = 'SELECT * FROM users WHERE username=?';
    let emailquery = 'SELECT * FROM users WHERE email=?';

    var input_user = req.body['username'];
    var input_email = req.body['email'];
    //console.log("Making sure user doesn't already exist: "+input_user);
    //console.log(userquery);
    db.query(userquery, input_user, (err, result) => {
      if (err) throw err;
      else {
        if (result.length == 0) {
          db.query(emailquery, input_email, (err, result) => {
            if (err) throw err;
            else {
              if (result.length == 0) {
                //console.log("creating user");
                var salt = moment().format();
                const secret = req.body['password'];
                const hash = crypto
                  .createHmac('sha256', secret)
                  .update(salt)
                  .digest('hex');
                let sql = 'INSERT INTO users SET ?';
                let post = {
                  username: req.body['username'],
                  password: hash,
                  salt: salt,
                  email: req.body['email']
                };
                let query = db.query(sql, post, (err, result) => {
                  if (err) throw err;
                  //console.log(result);
                  //console.log("user created:"+input_user)
                  res.redirect('/');
                });
              } else {
                //console.log("email taken");
                res.send('email taken');
              }
            }
          });
        } else {
          //console.log("usernametaken");
          res.send('username taken');
        }
      }
    });
    //res.redirect('/');
  });

  //sign in user makes sure user exists then hashes input and check if it matches with db
  app.post('/signin', urlencodedParser, (req, res) => {
    var username = req.body['username'];
    var password = req.body['password'];
    const secret = password;
    let sql = 'SELECT * FROM users WHERE username = ?';

    let query = db.query(sql, [username], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log('invalid username');
        res.send('invalid username');
      } else {
        //console.log("found: "+result.length+" results.")
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          var salt = row.salt;
          var hash = crypto
            .createHmac('sha256', secret)
            .update(salt)
            .digest('hex');
          if (hash == row.password) {
            req.session.username = username;
            //console.log('req.session.username: '+req.session.username);
            usertheme = result[0].theme;
            //console.log('usertheme before redirecting to dashboard: ' + usertheme);
            res.send('/indexsignedin');
          } else {
            console.log('incorrect password');
            res.send('invalid password');
          }
        }
      }
    });
    //cookies
    console.log('==================cookies==================');
    console.log(req.cookies);
    console.log('==================session==================');
    console.log(req.session);
    console.log('=============sign-in complete==============');
  });
};
