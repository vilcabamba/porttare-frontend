(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('MenuController', MenuController);

  function MenuController(categories) {
    var vmMenu = this;
    vmMenu.categories = categories.provider_categories;//jshint ignore:line
  }
})();
