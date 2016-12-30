(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderOrdersController', ProviderOrdersController);

  function ProviderOrdersController(ProviderCustomerOrders, ErrorHandlerService) {
    var poVm = this;
    poVm.cambiarTab = cambiarTab;
    init();

    function init(){
      getProviderCustomerOrdersStatus('submitted', 1);
    }

    function getProviderCustomerOrdersStatus(status, tab){
      ProviderCustomerOrders.getProviderCustomerOrdersStatus(status).then(function success(resp){
        poVm.customerOrders = resp.customer_orders; // jshint ignore:line
        poVm.tab = tab;
      }, ErrorHandlerService.handleCommonErrorGET);
    }

    function cambiarTab(tab){
      var status = tab===1 ? 'submitted': 'completed';
      getProviderCustomerOrdersStatus(status, tab);

    }

  }
})();
