(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('TermsAndCondController', TermsAndCondController);

  function TermsAndCondController($auth, APP, UserAuthService, $state, $ionicLoading, $ionicPopup){

    var terCondVm = this;
    terCondVm.agreeTermsOfService = agreeTermsOfService;

    function agreeTermsOfService() {
      var data = $auth.user;
      UserAuthService.agreeTermsOfService(data)
        .then(function success() {
          $auth.user.agreed_tos = true; //jshint ignore:line
          $state.go(APP.successState)
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
