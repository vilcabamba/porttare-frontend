(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('MenuController', MenuController);

  function MenuController($auth,
                          $scope,
                          categories,
                          CategoriesService,
                          ErrorHandlerService) {
    var vmMenu = this;
    vmMenu.categories = categories.provider_categories;

    $scope.$watch(function(){
      return $auth.user && $auth.user.customer_order;
    }, init);

    $scope.$on('order-created', function(event, order) {
      $auth.user.customer_order = order;
      vmMenu.existCartActive = true;
    });

    $scope.$on('order-finished', function() {
      vmMenu.existCartActive = false;
    });

    $scope.$on('update-categories', function() {
      CategoriesService.getCategories()
        .then(function success(res) {
          vmMenu.categories = res.data.provider_categories;
        }, ErrorHandlerService.handleCommonErrorGET);
    });

    function init(){
      vmMenu.existCartActive = false;
      if ($auth.user && $auth.user.customer_order) {
        vmMenu.existCartActive = true;
      }
    }
  }
})();
