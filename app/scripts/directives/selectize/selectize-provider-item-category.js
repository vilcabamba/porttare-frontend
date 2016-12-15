(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('selectizeprovideritemcategory', selectizeProviderItemCategory);

  function selectizeProviderItemCategory() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        options: '=',
        config: '=',
        item: '='
      },

      link: function(scope, elemento, attrs) {//jshint ignore:line
        console.log(elemento);
        var selectize = elemento.selectize(scope.config)[0].selectize;
        console.log(selectize);
        angular.forEach(scope.options, function(tag) {
          selectize.addOption(tag);
        });
        selectize.addItem(scope.item.provider_item_category_id);//jshint ignore:line

        function optionAdd(value) {
          scope.item.provider_item_category_attributes= {nombre: value}; //jshint ignore:line
        }

        function itemRemove(value){
          if(scope.item.provider_item_category_attributes){ //jshint ignore:line
            selectize.removeOption(value);
          }
          scope.item.provider_item_category_attributes = undefined; //jshint ignore:line
        }

        selectize.on('option_add', optionAdd);
        selectize.on('item_remove', itemRemove);
      }
    };
  }
})();
