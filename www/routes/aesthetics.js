module.exports = (app, urlencodedParser, db) => {
  //old...delete?
  app.post('/changeTheme', urlencodedParser, (req, res) => {
    var newTheme = req.body['theme'];
    usertheme = newTheme;
    console.log('change theme for: ' + req.session.username);
    let sql = 'UPDATE users SET theme = ? WHERE username = ?';
    let query = db.query(
      sql,
      [newTheme, req.session.username],
      (err, result) => {
        if (err) throw err;
        console.log(result);
      }
    );

    res.send('sent from changeTheme post' + req.session.username);
  });
};
