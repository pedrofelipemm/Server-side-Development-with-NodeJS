var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify')
var Favorites = require('../models/favorites');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')

    .all(Verify.verifyOrdinaryUser)
  
    .get(function(req, res, next) {
        var userId = req.decoded._doc._id;
        
        Favorites.find({user: userId})
            .populate('user')
            .populate('dishes')
            .exec(function(err, dish) {
                if (err) throw err;
                res.json(dish);
            });
        })

    .post(function(req, res, next) {
        var userId = req.decoded._doc._id;
        var dishId = req.body._id;

        Favorites.count({user: userId}, function(err, count) {
            if (err) throw err;
            if (count === 0) {
                Favorites.create({user: userId}, function(err, favorites) {
                    if (err) throw err;
                    favorites.dishes.push(dishId);
                    favorites.save(function(err, favorites) {
                        if (err) throw err;
                        res.json(favorites);
                    });
                });
            } else {
                Favorites.findOne({user: userId}, function(err, favorites) {
                    if (favorites.dishes.indexOf(dishId) > -1) {
                        res.json(favorites);
                    } else {
                        favorites.dishes.push(dishId);
                        favorites.save(function(err, favorites) {
                            if (err) throw err;
                            res.json(favorites);
                        });
                    }
                });
            }
        });
    })
  
    .delete(function(req, res, next) {
        var userId = req.decoded._doc._id;
        
        Favorites.remove({user: userId}, function(err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

router.route('/:dishId')

    .all(Verify.verifyOrdinaryUser)
  
    .delete(function(req, res, next) {
        var userId = req.decoded._doc._id;
        var dishId = req.params.dishId;
    
        Favorites.findOne({user: userId}, function(err, favorites) {
            if (err) throw err;
            for (var i = (favorites.dishes.length - 1); i >= 0; i--) {
                if (favorites.dishes[i] == dishId) {
                    favorites.dishes.splice(i, 1);
                }
            }
            favorites.save(function(err, favorites) {
                if (err) throw err;
                res.json(favorites);
            });
        });
    })

module.exports = router