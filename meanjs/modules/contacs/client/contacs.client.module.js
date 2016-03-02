(function (app) {
  'use strict';

  app.registerModule('contacs');
  app.registerModule('contacs.services');
  app.registerModule('contacs.routes', ['ui.router', 'contacs.services']);
})(ApplicationConfiguration);
