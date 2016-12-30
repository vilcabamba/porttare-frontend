(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ProviderCustomerOrders', ProviderCustomerOrders);

  function ProviderCustomerOrders($http, ENV) {

    var service = {
      getProviderCustomerOrdersStatus: getProviderCustomerOrdersStatus,
    };

    return service;

    function getProviderCustomerOrdersStatus(status) {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/provider/customer_orders?status='+status
      }).then(function success(resp) {
          return resp.data;
      });
    }

  }
})();
