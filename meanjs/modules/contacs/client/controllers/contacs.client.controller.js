(function () {
  'use strict';

  angular
    .module('contacs')
    .controller('ContacsController', ContacsController);

  ContacsController.$inject = ['$scope', '$state', 'contacResolve', 'Authentication'];

  function ContacsController($scope, $state, contac, Authentication) {
    var vm = this;

    vm.contac = contac;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contac
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.contac.$remove($state.go('contacs.list'));
      }
    }

    // Save Contac
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contacForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contac._id) {
        vm.contac.$update(successCallback, errorCallback);
      } else {
        vm.contac.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contacs.view', {
          contacId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


  }

})();
