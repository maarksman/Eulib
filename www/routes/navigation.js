module.exports = (app, urlencodedParser, db, fs) => {
  function nextlevel(level, pressdir) {
    //return string of next level to search
    let toadd;
    if (pressdir == 'left') {toadd = -1;}
    if (pressdir == 'right') {toadd = 1;}
    let next = (parseInt(level) + toadd).toString();
    return next;
  }

  app.post('/arrowcontent', urlencodedParser, (req, res) => {
    const id_in = req.body['clickedid'];
    const leftorright = req.body['leftorright'];
    console.log('id_in is: ' + id_in);
    //knowls store path starting from 'knowlcontant' folder
    //check lastleft and lastright\
    let islast = true;
    let tosend;
    let myobj = {found:false};
    let idquery = db.query(
        'SELECT * FROM article WHERE id=' + id_in,
        (err, result) => {
          if (err) throw err;
          else {
            if (result.length > 0) {
              row = result[0];
              let newcurlevel = row.level;
              let title = row.title;
              let pathtofile =  'public/' + row.path;
              console.log("path from table is:" + row.path);
              //do query checking for next button id as callback
              let contents = fs.readFile(pathtofile, 'utf8', (err, data) => {
                if (err) {console.log("error reading");throw err;}
                else {
                  let contents = data;
                  let ahead = db.query(
                      "SELECT * FROM article WHERE title='" + title +  "' AND level="
                      + nextlevel(newcurlevel, leftorright), (err, result) => {
                        // if found new arrow afte r press, send it
                        if (result.length > 0) {
                          islast = false;
                          let nextid = result[0].id;
                          console.log('contents are: ');
                          console.log(contents);
                          myobj = {
                            found: true,
                            content: contents,
                            islast : islast,
                            nextid : nextid
                          };
                          tosend = JSON.stringify(myobj);
                          res.send(tosend);
                        }
                        // if no content for new arrow, send json to indicate
                        else {
                          myobj = {
                            found: true,
                            content: contents,
                            islast : islast
                          };
                          tosend = JSON.stringify(myobj);
                          res.send(tosend);
                        }
                  });
                }
              });
            }
            // if we don't find sql entry for id, found = false
            else {
              tosend = JSON.stringify(myobj);
              res.send(tosend);
            }
          }
        });
  });
};
