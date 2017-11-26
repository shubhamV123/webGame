const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
const logger = require('./utils/logger');
const port = process.env.PORT || 3000;
//Middlewares
require('./config/passport')(passport);
app.use(passport.initialize());

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
require('./apis/login')(app, passport, logger);
require('./routes/routes')(app, passport, logger);
app.listen(port, () => {
	logger.info('Express running');
});