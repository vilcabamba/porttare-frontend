(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ProviderCustomerOrdersService', ProviderCustomerOrdersService);

  function ProviderCustomerOrdersService($http, CommonService, ENV) {

    var service = {
      getProviderCustomerOrdersByStatus: getProviderCustomerOrdersByStatus,
      getCustomerOrder: getCustomerOrder
    };

    return service;

    function getProviderCustomerOrdersByStatus(status) {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/provider/customer_orders?status='+status
      }).then(function success(resp) {
          return resp.data;
      });
    }

    function getCustomerOrder(id){
      var url = '/api/provider/customer_orders/';
      return CommonService.getObject(url, id).then(function (response){
        return response.customer_order; // jshint ignore:line
      });
    }
  }
})();
