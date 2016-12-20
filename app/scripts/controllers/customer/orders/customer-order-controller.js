(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerOrderController', CustomerOrderController);

  function CustomerOrderController(customerOrder) {
    var customerOrderVm = this;
    customerOrderVm.customerOrder = customerOrder;
  }
})();
