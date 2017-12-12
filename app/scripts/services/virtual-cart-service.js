(function(){
  'use strict';

  angular
    .module('porttare.services')
    .factory('VirtualCartService', VirtualCartService);

  function VirtualCartService($localStorage) {
      var service = {
          addItem: addItem,
          getCount: getCount
      };

      return service;

      function addItem(item) {
        var cart = $localStorage.getItem('cart');
        if(cart){
          cart = JSON.parse(cart);
        }else{
          cart = [];
        }
        cart.push(item);
        $localStorage.setItem('cart', JSON.stringify(cart));
      }

      function getCount(){
        var cart = $localStorage.getItem('cart');
        if(cart){
          cart = JSON.parse(cart);
          return cart.length;
        }else{
          return 0;
        }
      }

      // function removeItem(item){
      //   var cart = $localStorage.getItem('cart');
      //   if(cart){
      //     cart = JSON.parse(cart);
      //   }

      //   $localStorage.setItem('cart', cart);
      // }
  }
})();
