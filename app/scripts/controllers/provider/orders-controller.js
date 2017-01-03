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
        .then(function success(customerOrders){
          poVm.customerOrders = customerOrders;
        }, ErrorHandlerService.handleCommonErrorGET);
    }
  }
})();
