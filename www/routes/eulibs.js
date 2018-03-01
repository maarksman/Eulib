module.exports = (app, urlencodedParser, db, fs) => {
  app.post('/articlecreate', urlencodedParser, (req, res) => {
    let belongs_to = req.body['field'];
    let title = req.body['title'];
    let type = req.body['type'];
    let level = req.body['level'];
    let creator = req.session.username;
    let content = '<div>' + req.body['content'] + '</div>';
    let search_name = `${title}(${belongs_to}) - ${type}`;
    let checksql =
      `SELECT title FROM article where title ='${title}' AND
      level=${level} AND type='${type}' AND belongs_to='${belongs_to}' `
    let knowl_exists = false;
    db.query(checksql, (err, result) => {
      if (err) throw err;
      else {
        if (result.length == 0) {
          createsql =
            `INSERT INTO article (search_name, title, type, belongs_to, path, creator, level)
             VALUES ('${search_name}', '${title}', '${type}', '${belongs_to}', 'undefined',  '${creator}', ${level} )`;
          console.log('Query is: ' + createsql);
          db.query(createsql, (err, result) => {
            if (err) {
              throw err;
            }
            // after doing query, write file with Id as Name and insert path into row
            let id = result.insertId;
            let filename = title + "_" + result.insertId + '.html';
            let contentpath = 'public/knowlcontent/' + filename;
            let knowlpath = 'knowlcontent/' + filename;
            fs.writeFile(contentpath, content, function(err) {
              if (err) throw err;
              putpathquery = `UPDATE article SET path=? WHERE id=?;`;
              console.log('put content:' + content + 'in ' + contentpath);
              db.query(putpathquery, [knowlpath, id], (err, result) => {
                console.log('update path of: ' + id  + " of " + filename + 'with path: ' + knowlpath);
                res.end();
              });
            });
          });
          // use fs module to write new file to "knowlcontent"
        } else {
          knowl_exists = true;
          if (knowl_exists) {
            res.send('Knowl exists');
          }
        }
      }
    });
  });

  //edit an article... knowl plugin box stays in edit page.. can still be removed
  //afterward so not a big issue
  app.post('/updatearticle', urlencodedParser, (req, res) => {
    if (req.session.username != null) {
      var title = req.body['search-text'];
      var path = req.body['path'];
      var content = req.body['content'];
      //console.log("title: "+title);
      //console.log("path: "+path);
      //console.log("content: "+content);
      //UPDATE [table] SET [column] = '[updated-value]' WHERE [column] = [value];
      let query = 'UPDATE article SET last_editor = ? WHERE title = ?';
      db.query(query, [req.session.username, title], (err, result) => {
        if (err) throw err;
        else {
          console.log('success');
        }
      });
      //console.log(typeof path);
      fs.writeFile('public\\' + path, '<div>' + content + '</div>', function(
        err
      ) {
        if (err) throw err;
        else {
          console.log('updated: ' + path);
        }
      });
      res.send('updated');
    } else {
      //alternative to removing edit button on index.html but keeping in pug page.
      res.send('user not logged in, cannot edit');
    }
  });

  //deletes article from db and deletes html file
  app.post('/deletearticle', urlencodedParser, (req, res) => {
    let id = req.body['id'];
    console.log('deleting: article of id: ' + id);
    db.query(
      'select path from article where id =?',
      id,
      (err, result) => {
        if (err) throw err;
        var row = result[0];
        var path = 'public\\' + row.path;
        console.log('pathtype: ' + typeof path);
        console.log(path);
        fs.unlink(path, err => {
          if (err) throw err;
          console.log('succssfully deleted: ' + path);
        });
      }
    );
    let query = 'DELETE FROM article WHERE id = ?';
    db.query(query, id, (err, result) => {
      if (err) throw err;
      else {
        res.send('removed article of id: ' + id + 'from db');
      }
    });
  });


  app.post('/getpathfromid', urlencodedParser, (req, res) => {
    let id = req.body['id'];
    db.query("SELECT path FROM article WHERE id=" + id , (err, result) => {
      if (err) throw err;
      else {
        let row = result[0];

        res.send(row.path);
      }
    });
  });

};
