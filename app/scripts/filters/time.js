(function () {
  'use strict';

  angular
    .module('porttare.filters')
    .filter('time', time);

  function time() {
    return function (value,formatStr) {
      var time = moment(value,["h:mm A"]).format(formatStr);
      return time;
    };
  }

})();
