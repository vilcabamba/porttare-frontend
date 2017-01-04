(function () {
'use strict';

  angular
    .module('porttare.services')
    .factory('AuthorizationService', AuthorizationService);

  function AuthorizationService($auth, $state, $ionicLoading, APP) {
    var service = {
      accessIfUserNotAuth: accessIfUserNotAuth,
      notShowWelcomeProvider: notShowWelcomeProvider
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

    function notShowWelcomeProvider() {
      return $auth.validateUser()
        .then(function userAuthorized(user) {
          if (!user.provider_profile) { //jshint ignore:line
            return;
          }else{
            $state.go('provider.items.index').then(function () {
              $ionicLoading.hide();
            });
          }
        }, function userNotAuthorized() {
          return;
        });
    }
  }
})();
