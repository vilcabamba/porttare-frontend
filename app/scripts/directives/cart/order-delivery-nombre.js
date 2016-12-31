(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('orderDeliveryNombre', orderDeliveryNombre);

  function orderDeliveryNombre(){
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'orderDeliveryNombreVM',
      controller: orderDeliveryNombreController,
      link: orderDeliveryNombreLink,
      template: '{{ orderDeliveryNombreVM.deliveryNombre }}',
      scope: {
        delivery: '=',
        addresses: '='
      }
    };
    return directive;
  }

  function orderDeliveryNombreController(){}

  function orderDeliveryNombreLink(scope){
    var orderDeliveryNombreVM = scope.orderDeliveryNombreVM;

    scope.$watch('orderDeliveryNombreVM.delivery', function(newDelivery) {
      if (newDelivery) {
        getCurrentDeliveryAddress();
      }
    }, true);

    function getCurrentDeliveryAddress(){
      var customerAddressId = orderDeliveryNombreVM.delivery.customer_address_id; // jshint ignore:line
      if (isShipping() && customerAddressId) {
        var currentAddress,
            addresses = orderDeliveryNombreVM.addresses;
        currentAddress = addresses.find(function (address) {
          return address.id === customerAddressId;
        });
        orderDeliveryNombreVM.deliveryNombre = currentAddress && currentAddress.nombre;
      } else {
        orderDeliveryNombreVM.deliveryNombre = '';
      }
    }

    function isShipping(){
      return orderDeliveryNombreVM.delivery.delivery_method === 'shipping'; // jshint ignore:line
    }
  }
})();
