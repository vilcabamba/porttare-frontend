(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('CartController', CartController);

  function CartController(CartService) {
    var cartVm = this;
    cartVm.hola = 1;

    init();

    function init(){
      CartService.getCart().then(function(response){
        cartVm.cart = response.customer_order; //jshint ignore:line
      });
    }
  }
})();
