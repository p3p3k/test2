'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Portfoli = mongoose.model('Portfoli'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an portfoli
 */
exports.create = function (req, res) {
  var portfoli = new Portfoli(req.body);
  portfoli.user = req.user;

  portfoli.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(portfoli);
    }
  });
};

/**
 * Show the current portfoli
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var portfoli = req.portfoli ? req.portfoli.toJSON() : {};

  // Add a custom field to the Portfoli, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Portfoli model.
  portfoli.isCurrentUserOwner = req.user && portfoli.user && portfoli.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(portfoli);
};

/**
 * Update an portfoli
 */
exports.update = function (req, res) {
  var portfoli = req.portfoli;

  portfoli.title = req.body.title;
  portfoli.content = req.body.content;

  portfoli.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(portfoli);
    }
  });
};

/**
 * Delete an portfoli
 */
exports.delete = function (req, res) {
  var portfoli = req.portfoli;

  portfoli.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(portfoli);
    }
  });
};

/**
 * List of Portfolis
 */
exports.list = function (req, res) {
  Portfoli.find().sort('-created').populate('user', 'displayName').exec(function (err, portfolis) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(portfolis);
    }
  });
};

/**
 * Portfoli middleware
 */
exports.portfoliByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Portfoli is invalid'
    });
  }

  Portfoli.findById(id).populate('user', 'displayName').exec(function (err, portfoli) {
    if (err) {
      return next(err);
    } else if (!portfoli) {
      return res.status(404).send({
        message: 'No portfoli with that identifier has been found'
      });
    }
    req.portfoli = portfoli;
    next();
  });
};
