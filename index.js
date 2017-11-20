const _ = require('lodash');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
//Middlewares
app.use(passport.initialize());
require('./config/passport')(passport);
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'bingo',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  next();
});
require('./routes/routes')(app, passport);
app.listen(3000, () => {
  console.log("Express running");
});
