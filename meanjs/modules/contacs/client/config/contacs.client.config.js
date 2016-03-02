(function () {
  'use strict';

  angular
    .module('contacs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Contact',
      state: 'contacs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'contacs', {
      title: 'Show Contacts',
      state: 'contacs.list'
    });

    /* Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'contacs', {
      title: 'Create Contacs',
      state: 'contacs.create',
      roles: ['user']
    });*/
  }
})();
