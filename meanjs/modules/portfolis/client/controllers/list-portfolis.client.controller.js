(function () {
  'use strict';

  angular
    .module('portfolis')
    .controller('PortfolisListController', PortfolisListController);

  PortfolisListController.$inject = ['PortfolisService'];

  function PortfolisListController(PortfolisService) {
    var vm = this;

    vm.portfolis = PortfolisService.query();
  }
})();
