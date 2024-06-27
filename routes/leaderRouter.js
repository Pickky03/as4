const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const leaderRouter = express.Router();
var authenticate = require("../authenticate");
const Leader = require('../models/leader')
leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    Leader.find({})
      .populate("comments.author")
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    authenticate.verifyUser,
    authenticate. verifyAdmin,
    (req, res, next) => {
      Leader.create(req.body)
        .then(
          (leader) => {
            console.log("leader Created ", leader);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(authenticate.verifyUser, authenticate. verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leader");
  })
  .delete(
    authenticate.verifyUser,
    authenticate. verifyAdmin, // cấp quyền chỉ admin được xóa
    (req, res, next) => {
      Leader.deleteMany({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.send("mon an da bi xoa");
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    Leader.findById(req.params.leaderId)
      .populate("comments.author")
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(
    authenticate.verifyUser,
    authenticate. verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("POST operation not supported on /leader/" + req.params.leaderId);
    }
  )
  .put(authenticate.verifyUser, authenticate. verifyAdmin, (req, res, next) => {
    Leader.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate. verifyAdmin,
    (req, res, next) => {
      Leader.findByIdAndDelete(req.params.leaderId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );
  module.exports = leaderRouter