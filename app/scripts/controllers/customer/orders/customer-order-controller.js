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
      getSummary();

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

    function getSummary(){
      customerOrderVm.customerOrder.subtotalVATCents = Math.round( customerOrderVm.customerOrder.subtotal_items_cents*customerOrderVm.VAT ); // jshint ignore:line
      customerOrderVm.customerOrder.totalCents = customerOrderVm.customerOrder.subtotal_items_cents + customerOrderVm.customerOrder.subtotalVATCents; // jshint ignore:line
    }
  }
})();
