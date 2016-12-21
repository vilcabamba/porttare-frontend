(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('UserAuthService', UserAuthService);

  function UserAuthService($auth, $state, $ionicLoading, $http, ENV) {
    var service = {
      checkIfEnabledProvider : checkIfEnabledProvider,
      acceptTermsCond : acceptTermsCond
    };

    return service;

    function checkIfEnabledProvider() {
      return $auth.validateUser()
      .then(function userAuthorized(user) {
        if (user.provider_profile.status === 'disabled') { //jshint ignore:line
          $state.go('disabledUserError').then(function () {
            $ionicLoading.hide();
          });
        }
        return;
      }, function userNotAuthorized() {
          return;
      });
    }

    function acceptTermsCond( data) {
      return $http({
        method: 'POST',
        data: data,
        url: ENV.apiHost + '/api/users/tos',
        headers: { 'Accept': 'application/json' }
      });
    }
  }
})();
