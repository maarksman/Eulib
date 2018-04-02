module.exports = (app, urlencodedParser, db, fs, formidable) => {
  app.post('/articlecreate', urlencodedParser, (req, res) => {
    let form = new formidable.IncomingForm();
    //console.log("os.tmpdir() is: " ,os.tmpdir());
    form.keepExtensions = true;
    form.uploadDir = "./public/knowlcontent/knowlimages";
    //note default image upload size should be width 218 px, heigh 148 px
    form.parse(req, (err, fields, files) => {
      //after form finish processing, proceed to create article
      let belongs_to = fields['field'];
      let title = fields['title'];
      let type = fields['type'];
      let level = fields['level'];
      let creator = req.session.username;
      let content = '<div>' + fields['content'] + '</div>';
      let search_name = `${title}(${belongs_to}) - ${type}`;


      console.log('fields are: ', fields);
      console.log('files are: ', files);

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
  });

  //edit an article... knowl plugin box stays in edit page.. can still be removed
  //afterward so not a big issue
  app.post('/updatearticle', urlencodedParser, (req, res) => {
    console.log("fired /updatearticle");
    if (req.session.username != null) {
      var content = req.body['content'];
      let edit_id = req.body['id'];
      let query = 'UPDATE article SET last_editor = ? WHERE id = ?';
      db.query(query, [req.session.username, edit_id], (err, result) => {
        if (err) throw err;
        else {
          console.log('updated record of article of id:', edit_id);
          //if successful, sarch database for path and
          db.query("SELECT * FROM  article WHERE id=?", edit_id, (err, wegot) => {
            if (err) throw err;
            else {
              //get path and other entries for console logging
              let path = wegot[0].path;
              let search_name = wegot[0].search_name;
              fs.writeFile('public\\' + path, content, function(
                err
              ) {
                if (err) throw err;
                else {
                  console.log('updated: ' + path);
                  res.send('updated content of: ' + edit_id + ' of: '+  search_name);
                } //else of w
              });
            }
          });
        }
      })
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
      if (err) res.send('undefined'); //send nothing if error
      else {
        let row = result[0];

        res.send(row.path);
      }
    });
  });

};
