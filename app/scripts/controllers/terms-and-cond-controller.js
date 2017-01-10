(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('TermsAndCondController', TermsAndCondController);

  function TermsAndCondController($auth, APP, UserAuthService, $state, $ionicLoading, $ionicPopup){

    var terCondVm = this;
    terCondVm.agreeTermsOfService = agreeTermsOfService;

    function agreeTermsOfService() {
      UserAuthService.agreeTermsOfService()
        .then(function success() {
          $auth.user.agreed_tos = true; //jshint ignore:line
          var path = $auth.user.current_place ? APP.successState:'app.places.index'; //jshint ignore:line
          $state.go(path)
            .then( function (){
              $ionicLoading.hide();
            });
        }, function error(){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: '{{::("globals.pleaseTryAgain"|translate)}}'
          });
        });
    }
  }
})();
