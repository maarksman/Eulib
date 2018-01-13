const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');

module.exports = (app, bodyParser) => {
  const jsonParser = bodyParser.json();
  //set up pug
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  //middlewares
  app.use(cookieParser());
  app.use(jsonParser);
  //app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(
    session({ secret: 'anything', saveUninitialized: true, resave: true })
  );
  //for serving static files found in public folder
  app.use(express.static('public'));
};
