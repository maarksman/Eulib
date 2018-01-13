module.exports = app => {
  //not sure if this is actually working?
  app.get('/', (req, res) => {
    // var themeButtonText;
    // if(!req.session.username) {
    // //  return res.sendFile(__dirname + '/public/index.html');
    // }
    console.log('entered /');
    // return res.redirect('/dashboard');
    if (req.session.username == null) {
      console.log('null');
      return res.sendFile(__dirname + '/public/index.html');
    } else {
      console.log(req.session.username);
      return res.redirect('/indexsignedin');
    }
  });
};

