(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('GeolocationService', GeolocationService);

  function GeolocationService($cordovaGeolocation, $q) {

    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    var service = {
      getCurrentPosition: getCurrentPosition
    };

    return service;

    function getCurrentPosition() {
      return $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function success(res){
          return res;
        }, function error(err) {
          // TODO translate me?
          var message = 'Imposible acceder a la geolocalización.';
          switch (err.code) {
            case 1:
              message += ' Denegada la peticion de Geolocalización.';
              break;
            case 2:
              message += ' No se ha encontrado la ubicación del dispositivo.';
              break;
            case 3:
              message += ' La petición caducó.';
              break;
          }
          return $q.reject(message);
        });
    }

  }
})();
