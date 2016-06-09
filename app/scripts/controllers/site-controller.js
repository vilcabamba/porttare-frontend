(function(){
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('SiteController', SiteController);

  function SiteController($rootScope, $ionicLoading, $auth) {

    $rootScope.$on('$stateChangeStart', function(event, toState){
      if (toState.name === 'login' && $auth.user.id) {
        event.preventDefault();
      }else{
        $ionicLoading.show({
          template: 'cargando...'
        });
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(){
      $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeError', function(){
      $ionicLoading.hide();
    });

  }
})();
