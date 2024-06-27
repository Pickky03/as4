const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const promotionRouter = express.Router();
var authenticate = require("../authenticate");
const Promotion = require("../models/promotion");
promotionRouter.use(bodyParser.json());

promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find({})
      .populate("comments.author")
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    authenticate.verifyUser,
    authenticate. verifyAdmin,
    (req, res, next) => {
      Promotion.create(req.body)
        .then(
          (promotion) => {
            console.log("promotion Created ", promotion);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promotion);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(authenticate.verifyUser, authenticate. verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Promotion");
  })
  .delete(
    authenticate.verifyUser,
    authenticate. verifyAdmin, // cấp quyền chỉ admin được xóa
    (req, res, next) => {
      Promotion.deleteMany({})
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

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .populate("comments.author")
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
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
      res.end("POST operation not supported on /Promotion/" + req.params.promotionId);
    }
  )
  .put(authenticate.verifyUser, authenticate. verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate. verifyAdmin,
    (req, res, next) => {
      Promotion.findByIdAndDelete(req.params.promotionId)
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
  module.exports = promotionRouter