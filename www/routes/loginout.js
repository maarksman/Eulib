module.exports = app => {
  //load indexsignedin.pug
  app.get('/indexsignedin', (req, res) => {
    //console.log('trying to print username' + req.session.username);
    var username = req.session.username;
    console.log('username: ' + username);
    console.log('session object is');
    console.log(req.session);
    if (req.session.username == null) {
      res.redirect('/');
    } else {
      res.render('indexsignedin', {
        name: username
      });
    }
  });
  //old signedin page?...delete?
  app.get('/dashboard', (req, res) => {
    console.log('entered /dashboard');
    var username = req.session.username;
  });

  //remove session username will remove ability for user to view logged in pages
  app.get('/signout', (req, res) => {
    console.log('Signing out user: ' + req.session.username);
    req.session.username = undefined;
    return res.redirect('../');
  });

  //loads profile page
  app.get('/signedin', (req, res) => {
    var username = req.session.username;
    console.log('/signedin - profile page: ' + username);
    if (req.session.username == null) {
      res.redirect('/');
    } else {
      res.render('newuserprofile', {
        name: username
      });
    }
  });
};
