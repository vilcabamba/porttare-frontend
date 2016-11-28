(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CategoriesController', CategoriesController);

  function CategoriesController($scope) {

    var categoryVm = this;
    var counter = 0;
    categoryVm.categories = $scope.$parent.menuVm.categories;

    $scope.$on('$ionicView.enter', function() {
      if (counter !== 0) {
        $scope.$emit('update-categories');
      }
      counter++;
    });

    $scope.$watch('$parent.menuVm.categories', function(newVal, oldVal){
      if (newVal !== oldVal) {
        categoryVm.categories = newVal;
      }
    });
  }
})();
