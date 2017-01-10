(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderOrdersController', ProviderOrdersController);

  function ProviderOrdersController(status,
                                    ProviderCustomerOrdersService,
                                    ErrorHandlerService,
                                    $scope) {
    var poVm = this;
    poVm.tab = status;

    $scope.$on('$ionicView.enter', function() {
      if (status === 'submitted') {
        $scope.$emit('update-orders-submitted');
      }
      init();
    });

    $scope.$watch('$parent.providerMainVm.providerOrders', function(newValue){
      poVm.customerOrders = newValue;
    });

    function init(){
      if (status !== 'submitted') {
        getProviderCustomerOrdersStatus(poVm.tab);
      }
    }

    function getProviderCustomerOrdersStatus(status){
      ProviderCustomerOrdersService
        .getProviderCustomerOrdersByStatus(status)
        .then(function success(customerOrders){
          poVm.customerOrders = customerOrders;
        }, ErrorHandlerService.handleCommonErrorGET);
    }
  }
})();
