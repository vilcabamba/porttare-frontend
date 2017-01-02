(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderOrderShowController', ProviderOrderShowController);

  function ProviderOrderShowController(customerOrder) {
    var providerOrderShowVM = this;
    providerOrderShowVM.customerOrder = customerOrder;
    providerOrderShowVM.customerOrderDelivery = getCustomerOrderDelivery();
    providerOrderShowVM.customerBillingAddress = getCustomerBillingAddress();
    providerOrderShowVM.dateDelivery = getDateDelivery();

    function getCustomerBillingAddress(){
      return customerOrder.customer_billing_address; // jshint ignore:line
    }

    function getCustomerOrderDelivery(){
      return customerOrder.provider_profiles[0].customer_order_delivery; // jshint ignore:line
    }

    function getDateDelivery(){
      return providerOrderShowVM.customerOrderDelivery.deliver_at; // jshint ignore:line
    }
  }
})();
