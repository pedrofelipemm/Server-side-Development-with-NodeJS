var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Verify  = require('./verify');
var bodyParser = require('body-parser');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')

    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        User.find({}, function (err, users) {
            if (err) throw err;
            res.json(users);
        });
    });

userRouter.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

userRouter.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
              var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

userRouter.route('/register')

    .post(function(req, res) {
        User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
            if (err) {
                return res.status(500).json({err: err});
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });

userRouter.route('/login')

    .post(function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({err: info});
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).json({err: 'Could not log in user'});
                }        
                var token = Verify.getToken(user);
                res.status(200).json({
                    status: 'Login successful!',
                    success: true,
                    user: user.username,
                    token: token
                });
            });
        })(req,res,next);
    });

userRouter.route('/login')

    .get(function(req, res) {
        req.logout();
        res.status(200).json({status: 'Bye!'});
    });

module.exports = userRouter;