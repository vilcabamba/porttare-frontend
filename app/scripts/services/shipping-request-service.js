(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ShippingRequestService', ShippingRequestService);

  function ShippingRequestService(CommonService) {
    var service = {
      getShippingRequest: getShippingRequest,
      getShippingRequests: getShippingRequests,
    };
    return service;

    function getShippingRequest(id){
      return CommonService
               .getObject(
                 '/api/courier/shipping_requests/',
                 id,
                 'shipping_request'
               );
    }

    function getShippingRequests(){
      return CommonService
               .getObjects(
                 '/api/courier/shipping_requests',
                 'shipping_requests'
               );
    }
  }
})();
