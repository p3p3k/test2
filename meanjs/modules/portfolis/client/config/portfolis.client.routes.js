(function () {
  'use strict';

  angular
    .module('portfolis.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('portfolis', {
        abstract: true,
        url: '/portfolis',
        template: '<ui-view/>'
      })
      .state('portfolis.list', {
        url: '',
        templateUrl: 'modules/portfolis/client/views/list-portfolis.client.view.html',
        controller: 'PortfolisListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Portfolis List'
        }
      })
      .state('portfolis.create', {
        url: '/create',
        templateUrl: 'modules/portfolis/client/views/form-portfolis.client.view.html',
        controller: 'PortfolisController',
        controllerAs: 'vm',
        resolve: {
          portfoliResolve: newPortfoli
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Portfolis Create'
        }
      })
      .state('portfolis.edit', {
        url: '/:portfoliId/edit',
        templateUrl: 'modules/portfolis/client/views/form-portfolis.client.view.html',
        controller: 'PortfolisController',
        controllerAs: 'vm',
        resolve: {
          portfoliResolve: getPortfoli
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Portfoli {{ portfoliResolve.title }}'
        }
      })
      .state('portfolis.view', {
        url: '/:portfoliId',
        templateUrl: 'modules/portfolis/client/views/view-portfolis.client.view.html',
        controller: 'PortfolisController',
        controllerAs: 'vm',
        resolve: {
          portfoliResolve: getPortfoli
        },
        data:{
          pageTitle: 'Portfoli {{ portfoliResolve.title }}'
        }
      });
  }

  getPortfoli.$inject = ['$stateParams', 'PortfolisService'];

  function getPortfoli($stateParams, PortfolisService) {
    return PortfolisService.get({
      portfoliId: $stateParams.portfoliId
    }).$promise;
  }

  newPortfoli.$inject = ['PortfolisService'];

  function newPortfoli(PortfolisService) {
    return new PortfolisService();
  }
})();
