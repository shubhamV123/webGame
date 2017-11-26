let _ = require('lodash');
let jwt = require('jsonwebtoken');
let users = require('../models/user');
let config = require('../config/config');
let localStorage = require('localStorage');


const regExp = /^[a-zA-Z0-9]*$/;
module.exports = (app, passport, logger) => {
    app.post('/api/login',(req, res, next) => {
        if (req.body.name == '' || req.body.password == '') {
            res.json({
                error:true,
                message: 'Please fill all the fields'
            })
        } else if (!regExp.test(req.body.name)) {
            res.json({
                error:true,
                message: 'Only alphabets and numbers are allowed'
            })
        } else if ((req.body.password.length < 4)) {
             res.json({
                error:true,
                message: 'Password must be 4 character length and more'
            })
        }
        else {
            let user = users[_.findIndex(users, {
                name: req.body.name
            })];
            if (user === undefined) {
                res.status(401).json({
                    error:true,
                    message: 'User not defined'
                })

            } else {
                if (user.password === req.body.password) {
                    let payload = {
                        id: user.id
                    };
                    let token = jwt.sign(payload, config.jwtSecret);
                    res.json({
                        error:false,
                        message: "ok",
                        token: token
                    });

                } else {
                    res.status(401).json({
                        error:true,
                        message: 'Password did not match'
                    })

                }
            }
        }
    })
    
}