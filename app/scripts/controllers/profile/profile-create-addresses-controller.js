(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProfileCreateAddressesController', ProfileCreateAddressesController);

  function ProfileCreateAddressesController(ProfileAddressesService) {
    var pfaVm = this;
    pfaVm.addressFormData = {};
    pfaVm.messages = {};
    pfaVm.processAddress = processAddress;
    pfaVm.map = {
      center: {
        latitude: -5.19707042,
        longitude: -80.62662518
      },
      zoom: 18
    };

    function processAddress() {
      var options = {
        acionName: 'create',
        data: pfaVm.addressFormData
      };
      return ProfileAddressesService
        .runAction(options)
        .catch(function (response){
          if (response.errors) {
            pfaVm.messages = response.errors;
          }
      });
    }
  }
})();
