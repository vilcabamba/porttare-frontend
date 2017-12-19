(function () {
  'use strict';

  angular
    .module('porttare') //porttare module has ENV config
    .factory('$exceptionHandler', exceptionHandler);

  function exceptionHandler($log, $localStorage, ENV) {
    if (!ENV.airbrakeProjectId) {
      return logToConsole; // do nothing if it's not set
    }

    var airbrake = new airbrakeJs.Client({
      projectId: ENV.airbrakeProjectId,
      projectKey: ENV.airbrakeProjectKey,
      reporter: 'xhr',
      host: ENV.airbrakeHost
    });
    airbrake.addFilter(function (notice) {
      notice.context.environment = ENV.name;
      var scripts = ENV.frontendUrl + '/scripts/scripts.js';
      var vendor = ENV.frontendUrl + '/scripts/vendor.js';
      notice.context.sourceMaps = {
        scripts: scripts + '.map',
        vendor: vendor + '.map'
      };
      return notice;
    });

    function notification(exception, cause) {
      airbrake.notify({
        error: exception,
        params: {
          angular_cause: cause //jshint ignore:line
        },
        session: {
          'auth_headers': $localStorage.getItem('auth_headers') // jshint ignore:line
        }
      });
      logToConsole(exception);
    }

    function logToConsole(exception) {
      $log.error(exception);
    }

    return notification;
  }
})();
