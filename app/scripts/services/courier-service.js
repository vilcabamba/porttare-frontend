(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('CourierService', CourierService);

  function CourierService($http, $q, ENV, ErrorHandlerService) {

    var service = {
      createNewCourier: createNewCourier,
      shippingRequests: shippingRequests,
      getObjectShippingRequests: getObjectShippingRequests
    };

    return service;

    function createNewCourier(data) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/courier/profile',
        data: data
      }).then(function success(res){
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function shippingRequests() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/courier/shipping_requests'
      }).then(function success(res){
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function getObjectShippingRequests(id){
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/courier/shipping_requests/'+id
      }).then(function success(response) {
        return response.data.shipping_request; // jshint ignore:line
      }).catch(
        ErrorHandlerService.handleCommonErrorGET
      );
    }

  }
})();
