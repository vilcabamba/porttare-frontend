(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('UserDevicesService', UserDevicesService);

  function UserDevicesService(){
    var service = {
      registerDevice: registerDevice
    };
    return service;

    function registerDevice(uid){
      console.log('registerDevice', uid);
    }
  }
})();
