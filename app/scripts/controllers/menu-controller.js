(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('MenuController', MenuController);

  function MenuController($scope,
                          categories,
                          CategoriesService,
                          currentUser,
                          ErrorHandlerService) {
    var vmMenu = this;
    vmMenu.currentUser = currentUser;
    vmMenu.categories = categories.provider_categories;

    $scope.$on('update-categories', function() {
      CategoriesService.getCategories()
        .then(function success(res) {
          vmMenu.categories = res.data.provider_categories;
        }, ErrorHandlerService.handleCommonErrorGET);
    });
  }
})();
