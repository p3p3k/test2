(function () {
  'use strict';

  angular
    .module('portfolis')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Portfolio',
      state: 'portfolis',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'portfolis', {
      title: 'List Portfolio',
      state: 'portfolis.list'
    });

    // Add the dropdown create item
    /*Menus.addSubMenuItem('topbar', 'portfolis', {
      title: 'Create Portfolio',
      state: 'portfolis.create',
      roles: ['user']
    });*/
  }
})();
