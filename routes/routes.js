const _ = require('lodash');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const config = require('../config/config');
const localStorage = require('localStorage');

const jsonpatch = require('fast-json-patch');
const request = require('request');
const urlConfig = require('../config/urlConfig');
// All routes for app
module.exports = (app, passport,logger) => {
	//Login route
	app.get('/', (req, res) => {
		if (localStorage.getItem('token') !== null) {
			res.redirect('/profile');
		} else {
			res.render('index');
		}
	});
	//login post route
	app.post('/login',(req,res,next) =>{
		var name = {
			name:req.body.name,
			password:req.body.password
		};
		request({
			url: urlConfig.url+'/api/login',
			method: 'POST',
			json: true,   // <--Very important!!!
			body: name
		}, function (error, response){
			if(response.body.error == true){
				req.flash('errorMsg',response.body.message);
				res.redirect('/');
			}
			else{
				
				localStorage.setItem('token', response.body.token);
				res.redirect('/profile');
			}
		});
	});
	//setting middleware for authentication
	app.use((request, response, next) => {
		var token =  localStorage.getItem('token');
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
	let i =0;//for saving all photos which user saves(there is another method also which override the current photo)
	//thumbnail post route(this page cant be access without jwt)
	app.post('/create',(req,res) =>{
		var token = req.headers['authorization'];
		var url = {
			url: req.body.url
		};		
		request({
			url: urlConfig.url+'/api/create',
			method: 'POST',
			json: true, 
			body:url,
			headers: {'authorization':token}
		}, function (error, response){
			if(response.body.error == true){
				req.flash('errorMsg',response.body.msg);
				res.redirect('/create');
			}
			else{
				logger.info('Downloaded successfully');
				req.flash('successMsg', response.body.msg);
				res.locals.successMsg = req.flash('successMsg');
				res.render('create',{image:response.body.image});
			}
		});
	});
	//Front view of thumnail generate or display
	app.get('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
		const user = req.user;
		res.render('create',{user:user});
	});
	//Main route after successfully login
	app.get('/profile', (req,res) => {
		var token = req.headers['authorization'];		
		request({
			url: urlConfig.url+'/api/secret',
			method: 'GET',
			json: true,   
			headers: {'authorization':token}
		}, function (error, response){
			if(error){
				req.flash('errorMsg', 'Unauthorized');
				res.redirect('/');
			}
			res.render('secret', {
				user: response.body
			});
		});
	});
	//This route contain patch request from user
	app.get('/patch', passport.authenticate('jwt', {session: false}), (req, res) => {
		let user = req.user;
		if(req.user.email!=undefined){
			//if already patched remove patch
			logger.error(req.user.email+' is removed');
			let patches = [
				{ op: 'remove', path: '/email' },
          
			];
			user = jsonpatch.applyPatch(user, patches).newDocument;
		}
		else{
      	//if patch is not done add patch to request
			let patches = [{op: 'add', path: '/email', value: 'johnChanged@email.com'}];
			user = jsonpatch.applyPatch(user, patches).newDocument;
			logger.log('successfully added patch');
		}
		res.redirect('/profile');
	});
	//route for logout
	app.get('/logout', (req, res) => {
		localStorage.clear();
		res.redirect('/');
	});
};
