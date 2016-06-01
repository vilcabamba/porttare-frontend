(function(){
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('LoginController', LoginController);

  function LoginController($rootScope, $state, $ionicLoading, $ionicPopup, $auth) {
    var loginVm = this;
    loginVm.login = login;

    loginVm.loginForm = {};
    var successState = 'app.playlists';

    $rootScope.$on('auth:validation-success', function () {
      $state.go(successState);
    });

    function login() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      $auth.submitLogin(loginVm.loginForm)
        .then(function () {
          $state.go(successState);
        })
        .catch(function (resp) {
          $ionicPopup.alert({
            title: 'Error',
            template: resp.errors.join(', ')
          });
        })
        .finally(function(){
          $ionicLoading.hide();
        });
    }
  }
})();
