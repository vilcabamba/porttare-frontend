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
    var menuVm = this;
    menuVm.currentUser = currentUser;
    menuVm.categories = categories.provider_categories;

    $scope.$on('update-categories', function() {
      CategoriesService.getCategories()
        .then(function success(res) {
          menuVm.categories = res.data.provider_categories;
        }, ErrorHandlerService.handleCommonErrorGET);
    });
  }
})();
