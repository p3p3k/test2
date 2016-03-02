(function () {
  'use strict';

  angular
    .module('portfolis.services')
    .factory('PortfolisService', PortfolisService);

  PortfolisService.$inject = ['$resource'];

  function PortfolisService($resource) {
    return $resource('api/portfolis/:portfoliId', {
      portfoliId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
