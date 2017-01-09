(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProfileController', ProfileController);

  function ProfileController($location) {
    var pVm = this,
        currentTab = $location.path().split("/")[3];
    pVm.tab = currentTab;
  }
})();
