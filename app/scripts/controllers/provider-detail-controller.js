(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderDetailController', ProviderDetailController);

  function ProviderDetailController(data) {
    var providerDetVm = this;
    providerDetVm.provider = data.provider_profile; //jshint ignore:line

    init();

    function init() {
      // jshint ignore:start
      var providerOffices = providerDetVm.provider.provider_offices;
      if (providerOffices.length > 0) {
        providerDetVm.openingTime = providerOffices[0].hora_de_apertura;
        providerDetVm.closingTime = providerOffices[0].hora_de_cierre;
      }
      // jshint ignore:end
    }
  }
})();
