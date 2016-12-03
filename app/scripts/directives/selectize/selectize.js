(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('selectize', selectize);

  function selectize() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        options: '=',
        config: '='
      },

      link: function(scope, elemento, attrs) {//jshint ignore:line
        var selectize = elemento.selectize(scope.config)[0].selectize;
        angular.forEach(scope.options, function(tag) {
          selectize.addOption(tag);
        });
      }
    };
  }
})();
