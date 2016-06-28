(function(){
'use strict';

  angular
    .module('porttare.controllers')
    .controller('RegisterController', RegisterController);

  function RegisterController($ionicLoading, $auth, $ionicPopup, $state) {
    var registerVm = this;
    registerVm.register = register;
    registerVm.registerForm = {};
    registerVm.loginWithFB = loginWithFB;

    var successState = 'app.playlists';

    function register() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      $auth.submitRegistration(registerVm.registerForm)
        .then(function() {
          $state.go('login').then(function(){
            $ionicPopup.alert({
              title: 'Alerta',
              template: 'Usuario creado satisfactoriamente'
            });
          });
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

    function loginWithFB() {
      $auth.authenticate('facebook')
        .then(function () {
          $state.go(successState);
        })
        .catch(function () {
          $ionicPopup.alert({
            title: 'Error',
            template: 'Hubo un error, intentalo nuevamente.'
          });
        });
    }
  }
})();
