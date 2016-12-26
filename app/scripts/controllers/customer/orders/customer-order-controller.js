(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CustomerOrderController', CustomerOrderController);

  function CustomerOrderController(customerOrder, ProfileAddressesService) {
    var customerOrderVm = this;
    customerOrderVm.customerOrder = customerOrder;
    customerOrderVm.customerAddress = null;

    function init() {
      var customerAddressId = customerOrderVm.customerOrder.customer_address_id;

      if(customerAddressId){

        ProfileAddressesService
          .getAddress(customerAddressId)
            .then(
              function(res){
                customerOrderVm.customerAddress = res;
              }
            );
      }
    }

    init();

  }
})();
