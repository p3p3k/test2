(function () {
  'use strict';

  angular
    .module('portfolis')
    .controller('PortfolisController', PortfolisController);

  PortfolisController.$inject = ['$scope', '$state', 'portfoliResolve', 'Authentication'];

  function PortfolisController($scope, $state, portfoli, Authentication) {
    var vm = this;

    vm.portfoli = portfoli;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Portfoli
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.portfoli.$remove($state.go('portfolis.list'));
      }
    }

    // Save Portfoli
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.portfoliForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.portfoli._id) {
        vm.portfoli.$update(successCallback, errorCallback);
      } else {
        vm.portfoli.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('portfolis.view', {
          portfoliId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
