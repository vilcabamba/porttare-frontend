(function () {
  'use strict';

  angular
    .module('porttare.filters')
    .filter('timeSchedule', timeSchedule);

  function timeSchedule() {
    return function (value) {
      var scheduleFormat = 'HH:mm Z';
      return moment(value, scheduleFormat);
    };
  }

})();
