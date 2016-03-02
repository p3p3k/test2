'use strict';

/**
 * Module dependencies
 */
var portfolisPolicy = require('../policies/portfolis.server.policy'),
  portfolis = require('../controllers/portfolis.server.controller');

module.exports = function (app) {
  // Portfolis collection routes
  app.route('/api/portfolis').all(portfolisPolicy.isAllowed)
    .get(portfolis.list)
    .post(portfolis.create);

  // Single portfoli routes
  app.route('/api/portfolis/:portfoliId').all(portfolisPolicy.isAllowed)
    .get(portfolis.read)
    .put(portfolis.update)
    .delete(portfolis.delete);

  // Finish by binding the portfoli middleware
  app.param('portfoliId', portfolis.portfoliByID);
};
