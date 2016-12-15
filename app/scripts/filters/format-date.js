(function () {
  'use strict';

  angular
    .module('porttare.filters')
    .filter('formatDate', formatDate);

  function formatDate() {
    return function (currentValue, formatStr) {
      var _date = new Date(currentValue);
      return moment(_date).format(formatStr);
    };
  }

})();
