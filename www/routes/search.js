module.exports = (app, urlencodedParser, db, fs) => {
  app.get('/eulibadded', (req, res) => {
    //i'm calling it eulib from now on instead of a knowl.
    console.log('article added to stack');
    res.send('article added to stack');
  });

  //populates search list options
  app.post('/searcharticle', urlencodedParser, (req, res) => {
    var search = req.body['search-text'];
    let tosend = '';
    let sql =
      "SELECT * FROM article WHERE title LIKE '%" + search + "%' AND level=3";
    // console.log('sent in /searcharticle: '+ search);
    //console.log('querying: ' + sql);
    let query = db.query(sql, (err, result) => {
      //console.log('did we get to query func?');
      if (err) throw err;
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
          let dlistelement =
            "<option data-path='" + path + "' value='" + display + "'>";
          tosend = tosend + dlistelement;
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
    let sql = 'SELECT * FROM article WHERE title =?';
    let isindatabase = false;
    let cangoright = false;
    let cangoleft = false;
    let rightpath = '';
    let leftpath = '';
    let query = db.query(sql, search, (err, result) => {
      if (err) throw err;
      else
        //console.log(result.length);
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          if (row.level == '3') {
            var path = row.path;
            isindatabase = true;
          }
          if (row.level == '2') {
            cangoleft = true;
            leftid = row.id;
          }
          if (row.level == '4') {
            cangoright = true;
            rightid = row.id;
          }
        }
      if (isindatabase) {
        content = fs.readFileSync('public/' + path, 'utf8');
        var jsonobj = {
          content: content,
          path: path,
          id: row.id,
          articlefound: isindatabase,
          cangoleft: cangoleft,
          cangoright: cangoright,
          rightid: rightid,
          leftid: leftid
        };
        // query to check for left/right
        //console.log(jsonobj);
        console.log('cangoleft then cangoright');
        console.log(jsonobj.cangoleft);
        console.log(jsonobj.cangoright);
        var sendjson = JSON.stringify(jsonobj);
      } else {
        var jsonobj = { articlefound: isindatabase };
        //console.log(jsonobj);
        var sendjson = JSON.stringify(jsonobj);
      }

      //console.log(sendjson);
      res.send(sendjson);
    });
  });
};
