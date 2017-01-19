(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerOrderController', CustomerOrderController);

  function CustomerOrderController($scope,
                                   customerOrder,
                                   ProfileAddressesService,
                                   BillingAddressesService,
                                   PusherService) {
    var customerOrderVm = this;
    customerOrderVm.VAT = 0.12;

    customerOrderVm.customerOrder = customerOrder;

    init();

    function init() {
      customerOrderVm.customerBillingAddress = getBillingAddress();
      getSumaryProvider();

      $scope.$on('$ionicView.enter', wsSubscribe);
      $scope.$on('$ionicView.leave', wsUnsubscribe);
    }

    function wsSubscribe() {
      PusherService.load().then(function () {
        var orderId = customerOrderVm.customerOrder.id;
        PusherService.listen(
          'private-customer_order.' + orderId,
          'update',
          customerOrderUpdated
        );
      });
    }

    function wsUnsubscribe() {
      var orderId = customerOrderVm.customerOrder.id;
      PusherService.unlisten('private-customer_order.' + orderId);
    }

    function customerOrderUpdated(response) {
      $scope.$apply(function(){
        customerOrderVm.customerOrder = response.customer_order; // jshint ignore:line
      });
    }

    function getBillingAddress(){
      return customerOrderVm.customerOrder.customer_billing_address; // jshint ignore:line
    }

    function getSumaryProvider(){
      angular.forEach(customerOrderVm.customerOrder.provider_profiles, function (provider) {// jshint ignore:line
        provider.subtotal = getTotalCentsProviderItems(provider);
        provider.subtotalVAT = Math.round(provider.subtotal*customerOrderVm.VAT);
        provider.total = provider.subtotal+provider.subtotalVAT+ provider.customer_order_delivery.shipping_fare_price_cents;// jshint ignore:line
      });
    }

    function getTotalCentsProviderItems(provider) {
      var total = 0;
      angular.forEach(provider.customer_order_items, function (item) {// jshint ignore:line
        total += (item.provider_item_precio_cents * item.cantidad);// jshint ignore:line
      });
      return total;
    }

  }
})();
