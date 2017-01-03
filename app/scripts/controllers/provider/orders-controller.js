(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderOrdersController', ProviderOrdersController);

  function ProviderOrdersController(status,
                                    ProviderCustomerOrdersService,
                                    ErrorHandlerService) {
    var poVm = this;
    poVm.tab = status;
    init();

    function init(){
      getProviderCustomerOrdersStatus(poVm.tab);
    }

    function getProviderCustomerOrdersStatus(status){
      ProviderCustomerOrdersService
        .getProviderCustomerOrdersByStatus(status)
        .then(function success(resp){
          poVm.customerOrders = resp.customer_orders; // jshint ignore:line
        }, ErrorHandlerService.handleCommonErrorGET);
    }
  }
})();
