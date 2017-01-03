(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('cartButton', cartButton);

  function cartButton() {
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'cartButtonVM',
      controller: cartButtonController,
      templateUrl: 'templates/directives/cart-button/cart-button.html'
    };
    return directive;
  }

  function cartButtonController($auth,$scope) {
    // jshint validthis:true
    var cartButtonVM = this;
    cartButtonVM.getNumberItems=getNumberItems;
    cartButtonVM.getTotalItems=getTotalItems;
    cartButtonVM.existCartActive = false;

    if ($auth.user.customer_order) {//jshint ignore:line
      cartButtonVM.existCartActive = true;
      getNumberItems();
    }

    function getNumberItems(){
      var cantidadItem=0;
      angular.forEach($auth.user.customer_order.provider_profiles, function (provider) {//jshint ignore:line
        cantidadItem =cantidadItem+ getTotalItems(provider);
      });
      cartButtonVM.numberItems=cantidadItem;
    }

    function getTotalItems(provider) {
      var total = 0;
      if(provider.customer_order_items) {//jshint ignore:line
        total=provider.customer_order_items.length;//jshint ignore:line
      }
      return total;
    }

    $scope.$on('order-finished', function() {
      cartButtonVM.existCartActive = false;
    });

    $scope.$on('update-number', function() {
      getNumberItems();
    });
  }
})();
