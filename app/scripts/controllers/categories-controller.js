(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CategoriesController', CategoriesController);

  function CategoriesController($scope) {
    var categoryVm = this;
    var cacheInit = moment();

    categoryVm.categories = parentScopeCategories;
    categoryVm.categoryGridClassFor = categoryGridClassFor;

    $scope.$on('$ionicView.enter', function() {
      if (moment().diff(cacheInit, 'minutes') > 10) {
        $scope.$emit('update-categories');
      }
    });

    $scope.$watch('$parent.menuVm.categories', function(){
      categoryVm.categories();
    });

    function parentScopeCategories() {
      return $scope.$parent.menuVm.categories;
    }

    function unevenCategories() {
      return parentScopeCategories().length % 2 !== 0;
    }

    function categoryGridClassFor(index, last) {
      var divisibleByThree = (index + 1) % 3 === 0,
          fullWidth = divisibleByThree || (last && unevenCategories());
      if (fullWidth) {
        return 'grid-100';
      } else {
        return 'grid-50';
      }
    }
  }
})();
