module.exports = (app, db) => {
  //connect with database; if not connected throw error
  db.connect(err => {
    if (err) {
      throw err;
    }
    console.log('mysql connected');
  });
  //create db
  app.get('/createdb2', (req, res) => {
    let createtablesquery = ` drop table if exists article;
    drop table if exists users;
    drop table if exists user;
    drop table if exists field;
    drop table if exists user;
    drop table if exists type;
    drop table if exists bookmarks;
    drop trigger if exists bookdatetrigger;

    create table field(
    	field VARCHAR(30),
    	subfield_of VARCHAR(30),
    	PRIMARY KEY (field)
    );

    create table type(
      info_type VARCHAR(30),
      subtype1 VARCHAR(30),
      subtype2 VARCHAR(30),
      subtype3 VARCHAR(30),
      PRIMARY KEY (info_type)
    );

    create table user(
    	username VARCHAR(50) PRIMARY KEY,
    	password VARCHAR(100) NOT NULL,
    	first_name VARCHAR(50) ,
    	last_name VARCHAR(50) ,
    	salt VARCHAR(50),
    	account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    	theme TEXT,
    	email VARCHAR(50),
      source VARCHAR(200),
      UNIQUE (email)
    );

    create table article(
    	id INT PRIMARY KEY AUTO_INCREMENT,
    	title VARCHAR(30) NOT NULL,
    	type VARCHAR(30) NOT NULL,
      subtype VARCHAR(30),
      addtype VARCHAR(30),
      level INT,
      belongs_to VARCHAR(30),
    	FOREIGN KEY (belongs_to) REFERENCES field(field),
    	path VARCHAR(150) NOT NULL,
    	date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
      creator VARCHAR(50),
      FOREIGN KEY (creator) REFERENCES user(username),
    	last_edited DATETIME ON UPDATE CURRENT_TIMESTAMP,
      last_editor VARCHAR(50)
    );

    create table bookmarks(
      bookid INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50),
      title VARCHAR(30),
      field VARCHAR(30),
      last_edited DATETIME
    );

    INSERT INTO user (username, password, email) VALUES ('testuserpony', 'password', 'testuser1@eu.lib'),
    ('testuser2', 'password', 'Algebra@malgebra.com');

    INSERT INTO field VALUES ('Mathematics', NULL),
    ('Algebra', 'Mathematics'),
    ('Analysis', 'Mathematics'),
    ('Field Theory', 'Algebra');

    INSERT INTO type (info_type, subtype1) VALUES
    ('Definition', NULL),
    ('Example', NULL),
    ('Tutorial', NULL),
    ('Unspecified', NULL),
    ('Custom', NULL);

    INSERT INTO article ( title, type, belongs_to, path, creator, level)
    VALUES ( 'Automorphism', 'Definition', 'Analysis', 'knowlcontent/automorphism.html', 'testuserpony', 3),
     ( 'Field', 'Definition', 'Mathematics', 'knowlcontent/field.html', 'testuserpony', 3),
     ( 'Field Extension', 'Definition', 'Field Theory', 'knowlcontent/fieldextension.html', 'testuserpony', 3),
     ( 'Galois Group', 'Definition', 'Algebra', 'knowlcontent/galoisgroup.html', 'testuserpony', 3)
     `;

    db.query(createtablesquery, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
    res.redirect('/');
  });

  //show the contents of the database
  app.get('/show_db', (req, res) => {
    let sql = 'SELECT * FROM users';
    db.query(sql, (err, results, fields) => {
      if (err) throw err;
      str = '';
      for (i = 0; i < results.length; i++) {
        str = str + results[i].username + '  ' + results[i].password + '\n';
      }
      console.log(str);
      res.send('showing users table in node console');
      // res.render('signedin', {
      //   name : 'cool guy'
      // });
    });
  });
  /*
  app.get('/getfields', (req, res) => {
    var sentJSON = { fields: [] };
    let sql = 'SELECT DISTINCT belongs_to FROM article';
    let query = db.query(sql, (err, result) => {
      if (err) throw err;
      else {
        for (var i = 0; i < result.length; i++) {
          sentJSON.fields[i] = result[i].belongs_to;
        }
        let formattedsentJSON = JSON.stringify(sentJSON);
        res.send(formattedsentJSON);
      }
    });
  });
  */
};
