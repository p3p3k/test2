(function () {
  'use strict';

  angular
      .module('contacs')
      .controller('ContacsListController', ContacsListController);

  ContacsListController.$inject = ['ContacsService', '$scope'];

  function ContacsListController(ContacsService, $scope) {
    var vm = this;

    vm.contacs = ContacsService.query();


    $scope.alerts = [
      {
        name_icon:"glyphicon glyphicon-user",
        email_icon:"glyphicon glyphicon-edit",
        skype_icon:"glyphicon glyphicon-phone-alt",
        telephone_icon:"glyphicon glyphicon-earphone",
        facebook_icon:"glyphicon glyphicon-phone",
        color1:"btn-success",
        color2:"btn-info",
        color3:"btn-primary",
        color4:"btn-warning",
        color5:"btn-danger",
        name: 'Michal Takáč',
        email: 'email.takac@gmail.com',
        skype: '',
        telephone: '0908 123 123',
        facebook:"Michal Takáč"


      }
    ];
  }
})();
