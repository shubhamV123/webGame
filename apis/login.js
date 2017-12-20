let _ = require('lodash');
let jwt = require('jsonwebtoken');
let users = require('../models/user');
let Progress = require('../models/userProgress');
let config = require('../config/config');
let localStorage = require('localStorage');
let Jimp = require('jimp');
let jsonpatch = require('fast-json-patch');

let i = 0;
let regExp = /^[a-zA-Z0-9]*$/;
module.exports = (app, passport, logger) => {
	// api to check login authentication and genrate token
	app.post('/api/login', (req, res, next) => {
		if (req.body.name == '' || req.body.password == '') {
			res.json({
				error: true,
				message: 'Please fill all the fields'
			});
		} else if (!regExp.test(req.body.name)) {
			res.json({
				error: true,
				message: 'Only alphabets and numbers are allowed'
			});
		} else if ((req.body.password.length < 4)) {
			res.json({
				error: true,
				message: 'Password must be 4 character length and more'
			});
		} else {
			let user = users[_.findIndex(users, {
				name: req.body.name
			})];
			if (user === undefined) {
				res.status(401).json({
					error: true,
					message: 'User not found'
				});

			} else {
				if (user.password === req.body.password) {
					let payload = {
						id: user.id
					};
					let token = jwt.sign(payload, config.jwtSecret);
					res.json({
						error: false,
						message: 'ok',
						token: token
					});

				} else {
					res.status(401).json({
						error: true,
						message: 'Password did not match'
					});

				}
			}
		}
	});
	//api to check whether user is authenticated or not
	app.get('/api/secret', passport.authenticate('jwt', {
		session: false
	}), (req, res, next) => {
		res.json(req.user);
	});
	app.post('/api/progress', (req, res) => {
		console.log(req.body)
		if(req.body.complete=='true'){
			console.log('completed full')
		}
		else{
			console.log(req.body.collection.hearts.csuccess)
		var progress = new Progress({
			heartsLeft:req.body.collection.hearts.hleft,
			heartsSuccess:req.body.collection.hearts.hsuccess,
			clubsLeft: req.body.collection.clubs.cleft,
			clubsSuccess:req.body.collection.clubs.csuccess,
			diamondsLeft: req.body.collection.diamonds.dleft,
			diamondsSuccess:req.body.collection.diamonds.dsuccess,
			spadesLeft: req.body.collection.spades.sleft,
			spadesSuccess:req.body.collection.spades.ssuccess,
			user:req.body.collection.user
			});
		progress.save(function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log('successfully inserted');
			}
			return res.json({
				data: req.body
			})
		});
		}
	})
	// //api to create thumbnail of image
	// app.post('/api/create', passport.authenticate('jwt', {
	// 	session: false
	// }), (req, res, next) => {
	// 	Jimp.read(req.body.url, function (err, image) {
	// 		if (image != undefined) {
	// 			image.resize(50, 50) // resize                           
	// 				.write('public/images/thumbnail' + i + '.' + image.getExtension(), (err) => {
	// 					if (err) {
	// 						res.json({
	// 							error: true,
	// 							msg: 'Error in downloading'
	// 						});
	// 					}
	// 					var image1 = 'thumbnail' + i + '.' + this.getExtension();
	// 					i++;
	// 					res.json({
	// 						error: false,
	// 						msg: 'successfully downloaded',
	// 						image: image1
	// 					});
	// 				});
	// 		} else {
	// 			res.json({
	// 				error: true,
	// 				msg: 'Link is not valid'
	// 			});

	// 		}
	// 	});
	// });
	// //Patch api
	// app.patch('/api/patch', passport.authenticate('jwt', {
	// 	session: false
	// }), (req, res, next) => {
	// 	let user = req.user;
	// 	if (req.user.email != undefined) {
	// 		//if already patched remove patch
	// 		logger.error(req.user.email + ' is removed');
	// 		let patches = [{
	// 				op: 'remove',
	// 				path: '/email'
	// 			},

	// 		];
	// 		user = jsonpatch.applyPatch(user, patches).newDocument;
	// 		res.json(user)
	// 	} else {
	// 		//if patch is not done add patch to request
	// 		let patches = [{
	// 			op: 'add',
	// 			path: '/email',
	// 			value: 'johnChanged@email.com'
	// 		}];
	// 		user = jsonpatch.applyPatch(user, patches).newDocument;
	// 		res.json(user)
	// 		// logger.log('successfully added patch');
	// 	}
	// })

};