(function () {
  'use strict';

  angular
    .module('contacs.services')
    .factory('ContacsService', ContacsService);

  ContacsService.$inject = ['$resource'];

  function ContacsService($resource) {
    return $resource('api/contacs/:contacId', {
      contacId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
