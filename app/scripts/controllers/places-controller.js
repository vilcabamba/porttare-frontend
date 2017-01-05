(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('PlacesController', PlacesController);

  function PlacesController(places) {
    var placesVm = this;
    placesVm.places=places;
  }
})();
