const _ = require('lodash');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const config = require('../config/config');
const localStorage = require('localStorage');
const Jimp = require('jimp');
const jsonpatch = require('fast-json-patch');
var request = require('request');

module.exports = (app, passport,logger) => {
	app.get('/', (req, res) => {
		if (localStorage.getItem('token') !== null) {
			res.redirect('/secret');
		} else {
			res.render('index');
		}
	});

	app.post('/login',(req,res,next) =>{
		var name = {
			name:req.body.name,
			password:req.body.password
		};
		request({
			url: 'http://localhost:3000/api/login',
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
				res.redirect('/secret');
				// next();
			}
		});
	});
	app.use((request, response, next) => {
		var token = request.body.token || request.query.token || request.headers['x-access-token'] || localStorage.getItem('token');
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
	app.post('/create',(req,res) =>{
		Jimp.read(req.body.url, function (err, image) {
			if(image!=undefined){
				image.resize(50, 50)            // resize                           
					.write('public/images/thumbnail'+ i +'.'+image.getExtension(),(err) =>{
						if(err){
							logger.error('Error in downloading');
							req.flash('errorMsg', 'Error in downloading');
							res.redirect('/create');
						}
						var image1 = 'thumbnail'+i+'.'+this.getExtension();
						i++;
						logger.info('Downloaded successfully');
						req.flash('successMsg', 'Downloaded successfully');
						res.render('create',{image:image1});
					});
			}
			else{
				logger.error('Link is not valid');
				req.flash('errorMsg', 'Link is not valid');
				res.redirect('/create');
     
			}
		});
	});
	app.get('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
		const user = req.user;
		res.render('create',{user:user});
	});
	app.get('/secret', passport.authenticate('jwt', {
		session: false
	}), (req, res) => {
		let user = req.user;
		logger.info(user);
		res.render('secret', {
			user: user
		});
	});
	app.get('/patch', passport.authenticate('jwt', {session: false}), (req, res) => {
		let user = req.user;
		if(req.user.email!=undefined){
			logger.error(req.user.email+' is removed');
			let patches = [
				{ op: 'remove', path: '/email' },
          
			];
			user = jsonpatch.applyPatch(user, patches).newDocument;
		}
		else{
      
			let patches = [{op: 'add', path: '/email', value: 'johnChanged@email.com'}];
			user = jsonpatch.applyPatch(user, patches).newDocument;
			logger.log('successfully added patch');
		}
		res.redirect('/secret');
	});
	app.get('/logout', (req, res) => {
		localStorage.clear();
		res.redirect('/');
	});
};
