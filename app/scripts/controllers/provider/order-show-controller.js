(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderOrderShowController', ProviderOrderShowController);

  function ProviderOrderShowController(customerOrder) {
    var providerOrderShowVM = this;
    providerOrderShowVM.customerOrder = customerOrder;
    providerOrderShowVM.providerProfile = getProviderProfile();
    providerOrderShowVM.customerOrderDelivery = getCustomerOrderDelivery();
    providerOrderShowVM.customerBillingAddress = getCustomerBillingAddress();
    providerOrderShowVM.dateDelivery = getDateDelivery();
    providerOrderShowVM.errors = {};
    providerOrderShowVM.acceptOrder = acceptOrder;
    providerOrderShowVM.rejectOrder = rejectOrder;

    function getCustomerBillingAddress(){
      return customerOrder.customer_billing_address; // jshint ignore:line
    }

    function getProviderProfile(){
      return customerOrder.provider_profiles[0]; // jshint ignore:line
    }

    function getCustomerOrderDelivery(){
      return providerOrderShowVM.providerProfile.customer_order_delivery; // jshint ignore:line
    }

    function getDateDelivery(){
      return providerOrderShowVM.customerOrderDelivery.deliver_at; // jshint ignore:line
    }

    function acceptOrder(){
      console.log('acceptOrder!');
    }

    function rejectOrder(){
      if (reasonIsBlank()) {
        providerOrderShowVM.errors.reason = true;
      } else {
        providerOrderShowVM.errors.reason = false;
      }
    }

    function reasonIsBlank(){
      return angular.element.isEmptyObject(
        angular.element.trim(providerOrderShowVM.customerOrderDelivery.reason)
      );
    }
  }
})();
