(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ResetController', ResetController);

  function ResetController( $ionicLoading,
                            $auth,
                            $ionicPopup,
                            $state,
                            $rootScope,
                            $window,
                            $scope) {

    var resetVm = this;
    resetVm.updatePassword = updatePassword;
    resetVm.resetPassword = resetPassword;
    resetVm.updatePasswordForm = {};
    var successState = 'app.playlists';

    $rootScope.$on('auth:password-change-error', function (event, data) {
      $ionicPopup.alert({
        title: 'Error',
        template: data.errors.full_messages[0]//jshint ignore:line
      });
    });

    $rootScope.$on('auth:password-change-success', function () {
      $window.location.href = '/' + $state.href(successState);
    });

    function resetPassword() {
      resetVm.resetPasswordForm = {};
      var resetPasswordPopup = $ionicPopup.show({
        template: '<input type="email" ng-model="loginVm.resetPasswordForm.email"' +
        'placeholder="Correo electronico">',
        title: 'Recuperar contraseña',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Enviar</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!resetVm.resetPasswordForm.email) {
                e.preventDefault();
                $ionicPopup.alert({
                  title: 'El correo electrónico ingresado es inválido.'
                });
              } else {
                return resetVm.resetPasswordForm;
              }
            }
          }
        ]
      });

      resetPasswordPopup.then(function (resetPasswordForm) {
        $auth.requestPasswordReset(resetPasswordForm)
          .then(function () {
            $ionicLoading.show({
              template: 'Se enviaron las intrucciones al correo.',
              noBackdrop: true,
              duration: 2000
            });
          })
          .catch(function () {
            $ionicPopup.alert({
              title: 'Error',
              template: 'Hubo un error enviando la información.'
            });
          });
      });
    }

    function updatePassword() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      $auth.updatePassword(resetVm.updatePasswordForm)
        .finally(function () {
          $ionicLoading.hide();
        });
    }



  }
})();
