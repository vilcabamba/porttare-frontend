(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive(
      'providerEstimatedTimeForDispatchSelectize',
      providerEstimatedTimeForDispatchSelectize
    );

  function providerEstimatedTimeForDispatchSelectize(){
    return {
      restrict: 'A',
      link: providerEstimatedTimeForDispatchSelectizeLink,
      scope: {
        bindTo: '='
      }
    };

    function providerEstimatedTimeForDispatchSelectizeLink(scope,
                                                           el){
      var currentOptions,
          configs = getSelectizeConfigs(),
          selectize = el.selectize(configs)[0].selectize;

      currentOptions = configs.options;

      selectize.on('item_add', chooseEstimate);

      function chooseEstimate(value){
        scope.$apply(function(){
          scope.bindTo = value;
        });
      }

      function getSelectizeConfigs(){
        return {
          maxItems: 1,
          valueField: 'minutes',
          labelField: 'label',
          searchField: 'label',
          options: getSelectizeOptions(),
          create: selectizeCreateOption,
          createFilter: selectizeCreateOptionFilter
        };
      }

      function selectizeCreateOptionFilter(input){
        var inputVal = window.parseInt(input, 10),
            isIncluded;
        isIncluded = currentOptions.find(function(option){
          return option.minutes === inputVal;
        });
        return !isIncluded;
      }

      function selectizeCreateOption(input){
        var inputVal = window.parseInt(input, 10),
            newOption = createSelectizeOption(inputVal);
        currentOptions.push(newOption);
        return newOption;
      }

      function getSelectizeOptions(){
        var defaultOptions = [
          10, 20, 30, 45, 60
        ];
        return defaultOptions.map(createSelectizeOption);
      }

      function createSelectizeOption(qty){
        return {
          minutes: qty,
          label: qty + ' min'
        };
      }
    }
  }
})();
