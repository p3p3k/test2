'use strict';

/**
 * Module dependencies
 */
var contacsPolicy = require('../policies/contacs.server.policy'),
  contacs = require('../controllers/contacs.server.controller');

module.exports = function (app) {
  // Contacs collection routes
  app.route('/api/contacs').all(contacsPolicy.isAllowed)
    .get(contacs.list)
    .post(contacs.create);

  // Single contac routes
  app.route('/api/contacs/:contacId').all(contacsPolicy.isAllowed)
    .get(contacs.read)
    .put(contacs.update)
    .delete(contacs.delete);

  // Finish by binding the contac middleware
  app.param('contacId', contacs.contacByID);
};
