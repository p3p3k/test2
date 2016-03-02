(function () {
  'use strict';

  angular
    .module('contacs.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contacs', {
        abstract: true,
        url: '/contacs',
        template: '<ui-view/>'
      })
      .state('contacs.list', {
        url: '',
        templateUrl: 'modules/contacs/client/views/list-contacs.client.view.html',
        controller: 'ContacsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contacs List'
        }
      })
      .state('contacs.create', {
        url: '/create',
        templateUrl: 'modules/contacs/client/views/form-contacs.client.view.html',
        controller: 'ContacsController',
        controllerAs: 'vm',
        resolve: {
          contacResolve: newContac
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Contacs Create'
        }
      })
      .state('contacs.edit', {
        url: '/:contacId/edit',
        templateUrl: 'modules/contacs/client/views/form-contacs.client.view.html',
        controller: 'ContacsController',
        controllerAs: 'vm',
        resolve: {
          contacResolve: getContac
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contac {{ contacResolve.title }}'
        }
      })
      .state('contacs.view', {
        url: '/:contacId',
        templateUrl: 'modules/contacs/client/views/view-contacs.client.view.html',
        controller: 'ContacsController',
        controllerAs: 'vm',
        resolve: {
          contacResolve: getContac
        },
        data:{
          pageTitle: 'Contac {{ contacResolve.title }}'
        }
      });
  }

  getContac.$inject = ['$stateParams', 'ContacsService'];

  function getContac($stateParams, ContacsService) {
    return ContacsService.get({
      contacId: $stateParams.contacId
    }).$promise;
  }

  newContac.$inject = ['ContacsService'];

  function newContac(ContacsService) {
    return new ContacsService();
  }
})();
