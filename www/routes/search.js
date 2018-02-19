module.exports = (app, urlencodedParser, db, fs, asynceach) => {
  app.get('/eulibadded', (req, res) => {
    //i'm calling it eulib from now on instead of a knowl.
    //Knowls will reign!! also naming things is for people who write them :P
    console.log('article added to queue');
    res.send('article added to queue');
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
          let id = row.id;
          let field = row.field;
          var title = row.title;
          var type = row.type;
          let display = title;
          // + "-" + type;
          let dlistelement =
            "<option data-id='" + id + "' value='" + display + "'>";
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
    let rightid = '';
    let leftid = '';
    let query = db.query(sql, search, (err, result) => {
      if (err) throw err;
      else
        //console.log(result.length);
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          if (row.level == '3') {
            var path = row.path;
            var knowlid = row.id;
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
          id: knowlid,
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

  app.post('/multiarticleredir', urlencodedParser, (req, res) => {
    // same as search article redir -> just loop over enough times

    function sendifdone(sendindex, thejson) {
      if (thejson.length == sendindex){
        let knowlobjects = {'knowlinfo': thejson,
                            'numtorender': thejson.length
                            };

        console.log('WE ARE SENDING this back to the client:');
        console.log(knowlobjects);
        let tosend = JSON.stringify(knowlobjects);
        res.send(tosend);
      }
    }



    /*function id2object(id) {

    }*/

    const idlist = req.body['idlist[]'];
    const lastidindex = idlist.length;
    let tosend = {knowlinfo:[], numtorender:0};
    asynceach.forEach(idlist, function(item, index, arr) {
      let id = item;
      let done = this.async();
      let isindatabase = false;
      let path;
      let knowlid;
      let title;
      let cangoleft = false;
      let cangoright = false;
      let leftid = "";
      let rightid = "";
      let query = db.query("SELECT * FROM article WHERE id=?", id, (err, result) => {
        if (err) throw err;
        else
          //console.log(result.length);
          for (var i = 0; i < result.length; i++) {
            var row = result[i];
            if (row.level == '3') {
              path = row.path;
              title = row.title;
              knowlid = row.id;
              isindatabase = true;
            }
          }
        if (isindatabase) {
          content = fs.readFile('public/' + path, 'utf8', (err, data) => {
            if (err) {throw err;}
            else {
              // 2nd Query for the arrows
              db.query("SELECT * FROM article WHERE title='" + title + "'", (err,wegot) => {
                if (err) throw err;
                else {
                  console.log('2nd query fired!');
                  console.log(wegot);
                  for (j=0; j<wegot.length; j++) {
                    console.log('looping over 2nd query results!');
                    if (wegot[j].level == '2') {
                      console.log("Did we get here? finding level 2");
                      cangoleft = true;
                      leftid = wegot[j].id;
                    }
                    if (wegot[j].level == '4') {
                      cangoright = true;
                      rightid = wegot[j].id;
                    }
                  }
                  var jsonobj = {
                    content: data,
                    'path': path,
                    'id': knowlid,
                    articlefound: isindatabase,
                    'cangoleft': cangoleft,
                    'cangoright': cangoright,
                    rightid: rightid,
                    leftid: leftid
                  };
                  tosend.knowlinfo.push(jsonobj);
                  tosend.numtorender = tosend.numtorender + 1;
                  done();
                }
              });
            }
          });
          // query to check for left/right
          //console.log(jsonobj);
          //console.log('cangoleft then cangoright');
          //console.log(jsonobj.cangoleft);
          //console.log(jsonobj.cangoright);
        } else {
          var jsonobj = { articlefound: isindatabase };
          tosend.knowlinfo.push(jsonobj);
          done();
        }
      });
    }, function AllDone(notAborted, arr) {
        res.send(JSON.stringify(tosend))
       }
   );

  });
};
