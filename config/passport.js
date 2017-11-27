const _ = require('lodash'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	users = require('../models/user.js'),
	config = require('./config.js');
 // jwt strategy to find valid user and set user
module.exports = (passport) => {
	var jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromHeader('authorization');
	jwtOptions.secretOrKey = config.jwtSecret;
	var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
		// usually this would be a database call:
		var user = users[_.findIndex(users, {id: jwt_payload.id})];
		if (user) {
			next(null, user);
		} else {
			next(null, false);
		}
	});
    
	passport.use(strategy);
};
