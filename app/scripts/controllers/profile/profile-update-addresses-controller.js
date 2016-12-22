(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProfileUpdateAddressesController', ProfileUpdateAddressesController);

  function ProfileUpdateAddressesController(data, ProfileAddressesService) {
    var pfaVm = this;
    pfaVm.addressFormData = {};
    pfaVm.messages = {};
    pfaVm.inUpdateMode = true;
    pfaVm.processAddress = processAddress;
    pfaVm.addressFormData = data;
    pfaVm.map = {
      center: {
        latitude: -5.19707042,
        longitude: -80.62662518
      },
      zoom: 18
    };

    function processAddress() {
      var options = {
        acionName: 'update',
        data: pfaVm.addressFormData
      };
      ProfileAddressesService.runAction(options).catch(function (response){
        pfaVm.messages = response.errors;
      });
    }
  }
})();
