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

    function addItem(item) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/cart/items',
        data: item
      })
        .then(function success(response){
          return response.data;
        }, function error(response){
          return $q.reject(response.data);
        });
    }
  }
})();
