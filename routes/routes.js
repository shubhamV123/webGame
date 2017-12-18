const _ = require('lodash');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const config = require('../config/config');
const localStorage = require('localStorage');
const jsonpatch = require('fast-json-patch');
const request = require('request');
const urlConfig = require('../config/urlConfig');
// const cards = require('node-of-cards');
var Dealer = require('card-dealer');
    
// All routes for app
module.exports = (app, passport, logger) => {
	//Login route
	app.get('/', (req, res) => {
		if (localStorage.getItem('token') !== null) {
			res.redirect('/profile');
		} else {
			res.render('index');
		}
	});
	//login post route
	app.post('/login', (req, res, next) => {
		var name = {
			name: req.body.name,
			password: req.body.password
		};
		request({
			url: urlConfig.url + '/api/login',
			method: 'POST',
			json: true, // <--Very important!!!
			body: name
		}, function (error, response) {
			if (response.body.error == true) {
				req.flash('errorMsg', response.body.message);
				res.redirect('/');
			} else {

				localStorage.setItem('token', response.body.token);
				res.redirect('/profile');
			}
		});
	});
	//setting middleware for authentication
	app.use((request, response, next) => {
		var token = localStorage.getItem('token');
		request.headers['authorization'] = token;
		if (token) {
			jwt.verify(token, config.jwtSecret, (err, decoded) => {
				if (err) {

					response.json({
						'message': 'Failed to authenticate user'
					});
				} else {
					request.decoded = decoded;
					next();
				}
			});
		} else {
			logger.warn('Unauthorized');
			return response.sendStatus(401);
		}
	});
	
	//Main route after successfully login
	app.get('/profile', (req, res) => {
		var token = req.headers['authorization'];
		request({
			url: urlConfig.url + '/api/secret',
			method: 'GET',
			json: true,
			headers: {
				'authorization': token
			}
		}, function (error, response) {
			let Data= '';
			if (error) {
				req.flash('errorMsg', 'Unauthorized');
				res.redirect('/');
			}
			// cards.shuffle(0, function (err, data) {
			// 	Data = data.deck_id;
			// 	cards.draw(Data, function (err, data) {
			// 		// play around with data 
			// 		console.log(data)
			// 	  });
			//   });
			var Game =  Dealer.shuffle();
			console.log(Game);
			 
			res.render('secret', {
				user: response.body,
				random:Game
			});
		});
	});
	
	//logout route
	app.get('/logout', (req, res) => {
		localStorage.clear();
		res.redirect('/');
	});
};