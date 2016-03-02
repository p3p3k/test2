(function (app) {
  'use strict';

  app.registerModule('portfolis');
  app.registerModule('portfolis.services');
  app.registerModule('portfolis.routes', ['ui.router', 'portfolis.services']);
})(ApplicationConfiguration);
