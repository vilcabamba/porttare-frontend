(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderMainController', ProviderMainController);

  function ProviderMainController(providerOrders,
                              $scope,
                              $timeout,
                              APP,
                              ProviderCustomerOrdersService,
                              ErrorHandlerService)
  {
    var providerMainVm = this,
        timeout;

    providerMainVm.providerOrders = providerOrders;

    getOrders();


    function getOrders(){
      timeout = $timeout(function(){
        ProviderCustomerOrdersService
          .getProviderCustomerOrdersByStatus('submitted')
          .then(function success(customerOrders){
            providerMainVm.providerOrders = customerOrders;
          }, ErrorHandlerService.handleCommonErrorGET);
        getOrders();
      }, APP.timeoutDefault);
    }

    $scope.$on('$destroy', function(){
      $timeout.cancel(timeout);
    });

    $scope.$on('update-orders-submitted', function() {
      getOrders();
    });

  }
})();
