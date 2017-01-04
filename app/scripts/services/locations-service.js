(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('LocationsService', LocationsService);

  function LocationsService(CommonService) {
    var service = {
      getLocations: getLocations
    }
    return service;

    function getLocations() {
      return CommonService.getObjects('/api/users/places');
    }
  }
})();
