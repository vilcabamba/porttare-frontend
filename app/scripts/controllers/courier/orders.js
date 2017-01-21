(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('OrdersController', OrdersController);

  function OrdersController(shippingRequests) {
    var orVm = this;
    orVm.totalOrders = 0;
    orVm.mapRendered = mapRendered;

    init();

    function init() {
      orVm.orders = shippingRequests;
      orVm.totalOrders = orVm.orders.length;
    }

    function mapRendered(map){
      console.log(map);
    }
  }
})();
