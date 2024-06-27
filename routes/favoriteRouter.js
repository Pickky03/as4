// routes/favoriteRouter.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
      if (favorite) {
        for (let i = 0; i < req.body.length; i++) {
          if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
            favorite.dishes.push(req.body[i]._id);
          }
        }
        favorite.save()
          .then((favorite) => {
            Favorites.findById(favorite._id)
              .populate('user')
              .populate('dishes')
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
          }, (err) => next(err));
      } else {
        Favorites.create({ user: req.user._id, dishes: req.body })
          .then((favorite) => {
            Favorites.findById(favorite._id)
              .populate('user')
              .populate('dishes')
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
          }, (err) => next(err));
      }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOneAndRemove({ user: req.user._id })
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send('mon an da duoc xoa');
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
      if (favorite) {
        if (favorite.dishes.indexOf(req.params.dishId) === -1) {
          favorite.dishes.push(req.params.dishId);
          favorite.save()
            .then((favorite) => {
              Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite);
                })
            }, (err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
        }
      } else {
        Favorites.create({ user: req.user._id, dishes: [req.params.dishId] })
          .then((favorite) => {
            Favorites.findById(favorite._id)
              .populate('user')
              .populate('dishes')
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
          }, (err) => next(err));
      }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
      if (favorite) {
        const index = favorite.dishes.indexOf(req.params.dishId);
        if (index >= 0) {
          favorite.dishes.splice(index, 1);
          favorite.save()
            .then((favorite) => {
              Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.send('mon an da duoc xoa');
                })
            }, (err) => next(err));
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.json({ message: 'Dish not found in favorites' });
        }
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: 'No favorites found' });
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;
