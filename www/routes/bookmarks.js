module.exports = (app, urlencodedParser, db) => {
  // THIS DOENS'T WORK YET
  app.post('/makebookmark', urlencodedParser, (req, res) => {
    let bookinguser;
    if (req.session.username != null) {
      bookinguser = req.session.username;
    }
    let title = req.body['title'];
    //search for field and last edited using unique title
    let field;
    let fieldquery =
      "SELECT belongs_to from article WHERE title ='" + title + "'";
    let findfield = db.query(fieldquery, (err, result) => {
      if (err) throw err;
      else {
      }
    });

    makesql =
      "INSERT INTO bookmarks (title, field, username) VALUES ('" +
      title +
      "','" +
      field +
      "','" +
      bookinguser +
      "')";
    let tosend = '<p>Bookmark not made :-(</p>';
    let query = db.query(makesql, (err, result) => {
      if (err) throw err;
      else {
        let tosend = '<p>bookmark insert successful!</p>';
      }
      res.send(tosend);
    });
  });
};
