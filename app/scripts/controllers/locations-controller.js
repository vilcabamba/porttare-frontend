(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('LocationsController', LocationsController);

  function LocationsController(LocationsService) {
    var locationsVm = this;

    LocationsService.getLocations().then(function success(resp){
      locationsVm.locations=resp.places;
    });
  }
})();
