(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ModalService', ModalService);

  function ModalService($q, $ionicModal) {

    var service = {
      showModal: showModal,
      closeModal: closeModal
    };

    var modalInstance = {
      scope: null
    };

    return service;

    function showModal(options){

      var myOptions = {
        animation: 'slide-in-up',
        focusFirstInput: true
      };

      angular.extend(myOptions, options);

      modalInstance.scope = myOptions.parentScope;

      return $ionicModal.fromTemplateUrl(myOptions.fromTemplateUrl, {
        backdropClickToClose: false,
        hardwareBackButtonClose: false,
        scope: modalInstance.scope,
        animation: myOptions.animation,
        focusFirstInput: myOptions.focusFirstInput
      }).then(function(modal){
        modalInstance.scope.modal = modal;
        modalInstance.scope.modal.show();
      });
    }

    function closeModal(){
      if (modalInstance.scope && modalInstance.scope.modal) {
        return modalInstance.scope.modal.remove().then(function () {
          modalInstance.scope = null;
        });
      } else {
        return $q.resolve();
      }
    }
  }
})();
