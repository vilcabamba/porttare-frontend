(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderOrderShowController', ProviderOrderShowController);

  function ProviderOrderShowController(customerOrder) {
    var providerOrderShowVM = this;
    providerOrderShowVM.customerOrder = customerOrder;
  }
})();
