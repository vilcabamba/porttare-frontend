(function(){
  'use strict';

  angular
    .module('porttare.services')
    .factory('CartService', CartService);

  function CartService($http, ENV, $q) {
    var service = {
      addItem: addItem
    };

    return service;

    function addItem(productId, count) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/cart/items',
        data: {
          provider_item_id: productId, //jshint ignore:line
          cantidad: count
        }
      })
        .then(function success(response){
          return response.data;
        }, function error(error){
          return $q.reject(error.data);
        });
    }
  }
})();
