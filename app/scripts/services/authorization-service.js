(function () {
'use strict';

  angular
    .module('porttare.services')
    .factory('AuthorizationService', AuthorizationService);

  function AuthorizationService($auth, $state, $ionicLoading, APP) {
    var service = {
      accessIfUserNotAuth: accessIfUserNotAuth
    };

    return service;

    function accessIfUserNotAuth() {
      return $auth.validateUser()
        .then(function userAuthorized() {
          $state.go(APP.successState).then(function () {
            $ionicLoading.hide();
          });
        }, function userNotAuthorized() {
          return;
        });
    }
  }
})();
