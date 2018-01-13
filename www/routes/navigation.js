module.exports = (app, urlencodedParser, db, fs) => {
  app.post('/arrowcontent', urlencodedParser, (req, res) => {
    let pathin = req.body['pathin'];
    let level = req.body['curlevel'];
    const leftorright = req.body['leftorright'];
    console.log('curlevel is: ' + level);
    let rightlevel = (parseInt(level) + 2).toString();
    let leftlevel = (parseInt(level) - 2).toString();
    //knowls store path starting from 'knowlcontant' folder
    let totalpath = 'public/' + pathin;
    console.log('total path is: ' + totalpath);
    let contents = fs.readFileSync(totalpath, 'utf8');
    //check lastleft and lastright\
    let lastleft = true;
    let lastright = true;
    let tosend;
    if (leftorright == 'left') {
      let findleft = db.query(
        'SELECT * FROM article WHERE level=' + leftlevel,
        (err, result) => {
          if (err) throw err;
          else {
            if (result.length > 0) {
              lastleft = false;
              let myobj = {
                content: contents,
                lastleft: lastleft,
                lastright: lastright,
                newpath: result.path
              };
              tosend = JSON.stringify(myobj);
              res.send(tosend);
            } else {
              let myobj = {
                content: contents,
                lastleft: lastleft,
                lastright: lastright
              };
              tosend = JSON.stringify(myobj);
              res.send(tosend);
            }
          }
        }
      );
    } else if (leftorright == 'right') {
      let findright = db.query(
        'SELECT * FROM article WHERE level=' + rightlevel,
        (err, result) => {
          if (err) throw err;
          else {
            console.log('did we search for next level? resultlength is:');
            console.log(result.length);
            if (result.length > 0) {
              lastright = false;
              let myobj = {
                content: contents,
                lastleft: lastleft,
                lastright: lastright,
                newpath: result.path
              };
              tosend = JSON.stringify(myobj);
              res.send(tosend);
            } else {
              let myobj = {
                content: contents,
                lastleft: lastleft,
                lastright: lastright
              };
              tosend = JSON.stringify(myobj);
              res.send(tosend);
            }
          }
        }
      );
    }
  });
};
