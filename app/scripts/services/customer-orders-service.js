(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('CustomerOrdersService', CustomerOrdersService);

  function CustomerOrdersService($http, ENV, $q, ErrorHandlerService) {
    var service = {
      getCustomerOrders: getCustomerOrders,
      getCustomerOrder: getCustomerOrder,
      cancelCustomerOrder: cancelCustomerOrder
    };

    return service;

    function getCustomerOrders() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/orders'
      }).then(function (response) {
        return response.data.customer_orders; // jshint ignore:line
      });
    }

    function getCustomerOrder(customerOrderId) {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/orders/' + customerOrderId
      }).then(function (response) {
        return response.data.customer_order; // jshint ignore:line
      }).catch(
        ErrorHandlerService.handleCommonErrorGET
      );
    }

    function cancelCustomerOrder(customerOrderId,CustomerOrderDeliveryId){
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/orders/' + customerOrderId + '/deliveries/'+ CustomerOrderDeliveryId +'/cancel',
      })
        .then(function (response) {
          return response.data; // jshint ignore:line
        }).catch(
          ErrorHandlerService.handleCommonErrorGET
        );
    }

  }
})();
