const _ = require('lodash');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const config = require('../config/config');
const localStorage = require('localStorage');
const Jimp = require("jimp");

module.exports = (app, passport) => {
  app.get("/", (req, res) => {
    if (localStorage.getItem('token') !== null) {
      res.redirect('/secret');
    } else {
      res.render('index');
    }
  });

  app.post("/login", (req, res, next) => {

    if (req.body.name == '' || req.body.password == '') {
      req.flash('errorMsg', 'Please fill all fields');
      res.redirect('/');
    } else {
      let name = req.body.name;
      let password = req.body.password;
      // usually this would be a database call:
      let user = users[_.findIndex(users, {
        name: name
      })];
      if (user === undefined) {
        req.flash('errorMsg', 'no such user found');
        res.redirect('/');
      } else {
        if (user.password === req.body.password) {
          let payload = {
            id: user.id
          };
          let token = jwt.sign(payload, config.jwtSecret);
          localStorage.setItem('token', token);
          res.redirect('/secret');
          next();
        } else {
          req.flash('errorMsg', 'password did not match');
          res.redirect('/');
        }
      }
    }
  });
  app.use((request, response, next) => {
    var token = request.body.token || request.query.token || request.headers['x-access-token'] || localStorage.getItem('token');
    request.headers['authorization'] = token;
    if (token) {
      jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
          response.json({
            "message": "Failed to authenticate user"
          });
        } else {
          request.decoded = decoded;
          next();
        }
      });
    } else {
      return response.sendStatus(401);
    }
  });
  let i =0;//for saving all photos which user saves(there is another method also which override the current photo)
  app.post('/create',(req,res) =>{
    Jimp.read(req.body.url, function (err, image) {
      if(err){
        req.flash('errorMsg', 'Error in downloading or provide valid image link');
            res.redirect('/create');
      }
      if(image!=undefined){
      image.resize(50, 50)            // resize                           
      .write("public/images/thumbnail"+ i +"."+image.getExtension(),(err) =>{
        if(err){
          req.flash('errorMsg', 'Error in downloading');
              res.redirect('/create');
        };
        var image1 = "thumbnail"+i+"."+this.getExtension();
        i++;
        req.flash('successMsg', 'Downloaded successfully');
        res.render('create',{image:image1});
      });
    }
    else{
      req.flash('errorMsg', 'Link is not valid');
      res.redirect('/create');
     
    }
  });
  });
  app.get("/create", passport.authenticate('jwt', {session: false}), (req, res) => {
    // const user = req.user;
    res.render('create');
  });
  app.get("/secret", passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    const user = req.user;
    res.render('secret', {
      user: user
    });
  });
  app.get('/logout', (req, res) => {
    localStorage.clear();
    res.redirect('/');
  });
};
