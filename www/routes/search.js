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
      "SELECT * FROM article WHERE search_name LIKE '%" + search + "%' AND level=3";
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
          let display = row.search_name;
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
    var id = req.body['id'];
    console.log('id is: ', id);
    let content;
    let sql = 'SELECT * FROM article WHERE id =?';
    let isindatabase = false;
    let cangoright = false;
    let cangoleft = false;
    let rightid = '';
    let leftid = '';
    let title ='';
    let fields = [];
    let curfield;
    let query = db.query(sql, id, (err, result) => {
      if (err) throw err;
      else {
        //console.log(result.length);
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          if (row.level == '3') {
            var path = row.path;
            var knowlid = row.id;
            isindatabase = true;
            title = row.title;
            curfield = row.field;
          }
        }
        //after loop, next data processing
        if (isindatabase) {
          content = fs.readFile('public/' + path, 'utf8', (err, data)=> {
            if (err) throw err;
            else {
              //after reading file, searchf or levels and fields
              let gettitle = db.query("SELECT * FROM article WHERE title=?", title, (err, wegot) => {
                if (err) throw err;
                else {
                  for (j=0;j<wegot.length;j++) {
                    if (wegot[j].level == '2') {
                      cangoleft = true;
                      leftid = wegot[j].id;
                    }
                    if (wegot[j].level == '4') {
                      cangoright = true;
                      rightid = wegot[j].id;
                    }
                    if (wegot[j].belongs_to != curfield && wegot[j].level=="3") {
                      let fielddata = {'id': wegot[j].id, 'field':wegot[j].belongs_to};
                      fields.push(fielddata);
                    }
                 }
                //after loop, finsih nextdata processing
                var jsonobj = {
                  content: data,
                  path: path,
                  id: knowlid,
                  articlefound: isindatabase,
                  cangoleft: cangoleft,
                  cangoright: cangoright,
                  rightid: rightid,
                  leftid: leftid,
                  'fields': fields
                };
                console.log("json to send: ", jsonobj);
                var sendjson = JSON.stringify(jsonobj);
                res.send(sendjson);
              }
            });
          }
        });
      } else {
        var jsonobj = { articlefound: isindatabase };
        //console.log(jsonobj);
        var sendjson = JSON.stringify(jsonobj);
        res.send(sendjson);
      }
     }
  });
  });

  app.post('/multiarticleredir', urlencodedParser, (req, res) => {
    // same as search article redir -> just loop over enough times

    const idlist = req.body['idlist[]'];
    const lastidindex = idlist.length;
    let tosend = {knowlinfo:[], numtorender:0};
    asynceach.forEach(idlist, function(item, index, arr) {
      let id = item;
      let done = this.async();
      let isindatabase = false;
      let path;
      let knowlid;
      let field;
      let fieldlist = [];
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
              field = row.belongs_to;
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
                    if (wegot[j].belongs_to != field) {
                      let fielddata = {'id': wegot[j].id, 'field':wegot[j].belongs_to}
                      fieldlist.push(fielddata);
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
                    leftid: leftid,
                    'fields':fieldlist
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
