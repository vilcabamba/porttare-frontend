(function(){
  'use strict';

  angular
    .module('porttare.services')
    .factory('CartService', CartService);

  function CartService($http, ENV, $q, ErrorHandlerService) {
    var service = {
      addItem: addItem,
      getCart: getCart,
      checkout : checkout,
      updateOrderItem: updateOrderItem,
      removeOrderItem:removeOrderItem,
      isCartEmpty: isCartEmpty,
      findCartItem: findCartItem,
      canAddItem: canAddItem
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

    function removeOrderItem(orderItem) {
      return $http({
        method: 'DELETE',
        url: ENV.apiHost + '/api/customer/cart/items/'+ orderItem.id
      });
    }

    function getCart() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/cart'
      })
        .then(function success(response){
          return response.data;
        }).catch(ErrorHandlerService.handleCommonErrorGET);
    }

    function checkout(cartData) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/cart/checkout',
        data: cartData
      })
        .then(function success(response) {
          return response.data;
        }, function error(response) {
          return $q.reject(response.data);
        });
    }

    function updateOrderItem(cartItem){
      return $http({
        method: 'PUT',
        url: ENV.apiHost + '/api/customer/cart/items/' + cartItem.id,
        data: cartItem
      })
        .then(function success(response) {
          return response.data;
        }, function error(response) {
          return $q.reject(response.data);
        });
    }

    function isCartEmpty(customerOrder){
      return !customerOrder || !customerOrder.provider_profiles || customerOrder.provider_profiles.length == 0; //jshint ignore:line
    }

    function findCartItem(customerOrder, itemId){
      var orderItem = null;

      if( !isCartEmpty(customerOrder) ){
        for(var i = 0; i < customerOrder.provider_profiles.length && !orderItem; i++){ //jshint ignore:line
          var providerProfile = customerOrder.provider_profiles[i]; //jshint ignore:line

          for(var j=0; providerProfile.customer_order_items &&  i< providerProfile.customer_order_items.length && !orderItem; j++){ //jshint ignore:line
            var customerOrderItem = providerProfile.customer_order_items[j]; //jshint ignore:line

            if(customerOrderItem.id === itemId ){
              orderItem = customerOrderItem;
            }
          }
        }
      }

      return orderItem;
    }

    function canAddItem(orderItem, addCount, item){
      var currentCount = orderItem ? orderItem.cantidad : 0;
      var canAdd = ( currentCount + addCount <= item.cantidad);
      return canAdd;
    }
  }
})();
