(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProfileController', ProfileController);

  function ProfileController() {
    var pVm = this;
    pVm.tab = 'info';
  }
})();
