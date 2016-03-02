'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Contac = mongoose.model('Contac'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an contac
 */
exports.create = function (req, res) {
  var contac = new Contac(req.body);
  contac.user = req.user;

  contac.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contac);
    }
  });
};

/**
 * Show the current contac
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var contac = req.contac ? req.contac.toJSON() : {};

  // Add a custom field to the Contac, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Contac model.
  contac.isCurrentUserOwner = req.user && contac.user && contac.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(contac);
};

/**
 * Update an contac
 */
exports.update = function (req, res) {
  var contac = req.contac;

  contac.title = req.body.title;
  contac.content = req.body.content;

  contac.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contac);
    }
  });
};

/**
 * Delete an contac
 */
exports.delete = function (req, res) {
  var contac = req.contac;

  contac.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contac);
    }
  });
};

/**
 * List of Contacs
 */
exports.list = function (req, res) {
  Contac.find().sort('-created').populate('user', 'displayName').exec(function (err, contacs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contacs);
    }
  });
};

/**
 * Contac middleware
 */
exports.contacByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contac is invalid'
    });
  }

  Contac.findById(id).populate('user', 'displayName').exec(function (err, contac) {
    if (err) {
      return next(err);
    } else if (!contac) {
      return res.status(404).send({
        message: 'No contac with that identifier has been found'
      });
    }
    req.contac = contac;
    next();
  });
};
