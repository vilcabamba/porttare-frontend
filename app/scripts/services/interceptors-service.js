'use strict';

angular
  .module('porttare.services')
  .factory('InterceptorsService', InterceptorsService);

function InterceptorsService($injector, $q) {
  var service = {
    responseError: responseError
  };
  var currentAlert;

  return service;

  function responseError(rejection) {
    if (rejection.status === 401 && !rejection.config.url.match('api/auth/user/sign_in')) {
      closeCurrentAlert();
      createAlert();
    }
    return $q.reject(rejection);
  }

  function createAlert() {
    currentAlert = $injector.get('$ionicPopup').alert({
      title: 'Ups!',
      template: 'No tienes permisos para realizar eso!'
    });
    currentAlert.then(function(){
      unsetCurrentAlert();
      $injector.get('$auth').validateUser().then(function(){
        $injector.get('$state').go('app.categories.index');
      }).catch(function(){
        $injector.get('$state').go('prelogin');
      });
    });
  }

  function unsetCurrentAlert() {
    currentAlert = null;
  }

  function closeCurrentAlert() {
    if (currentAlert) {
      currentAlert.close();
    }
  }
}
