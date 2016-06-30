'use strict';

angular
  .module('porttare.controllers')
  .controller('PreController', PreController);

function PreController($auth, $state, $ionicPopup, $window) {
  var preVm = this;
  preVm.loginWithFB = loginWithFB;
  var successState = 'app.playlists';

  function load(){
    if ($window.localStorage && !$window.localStorage.getItem('hasViewedTutorial')) {
      $state.go('intro');
    }
  }

  load();

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
