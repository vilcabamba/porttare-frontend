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
        config: '=',
        item: '='
      },

      link: function(scope, elemento, attrs) {//jshint ignore:line
        var selectize = elemento.selectize(scope.config)[0].selectize;
        angular.forEach(scope.options, function(tag) {
          selectize.addOption(tag);
        });

        var change = function(value) {
          if(!scope.item.provider_item_category_attributes){ //jshint ignore:line
            scope.item.provider_item_category_id = value; //jshint ignore:line
          }
        };
        var optionAdd = function(value) {
          scope.item.provider_item_category_attributes= {nombre: value}; //jshint ignore:line
        };

        var optionRemove= function (){
          scope.item.provider_item_category_attributes = undefined; //jshint ignore:line
          scope.item.provider_item_category_id = undefined; //jshint ignore:line
        };

        selectize.on('change', change);
        selectize.on('option_add', optionAdd);
        selectize.on('option_remove', optionRemove);
      }
    };
  }
})();
