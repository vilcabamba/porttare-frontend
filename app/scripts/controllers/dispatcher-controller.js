(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('DispatcherController', DispatcherController);

  function DispatcherController(DispatchersService,
                                 ModalService,
                                 OfficesService,
                                 ErrorHandlerService,
                                 $scope,
                                 $ionicLoading,
                                 $ionicPopup) {

    var dispatchersVm = this;
    dispatchersVm.showEditDispatcher = showEditDispatcher;
    dispatchersVm.showDeleteDispatcher = showDeleteDispatcher;
    dispatchersVm.submitDispatcher = submitDispatcher;
    dispatchersVm.closeDispatcher = closeDispatcher;
    initDispatcher();

    function initDispatcher() {
      DispatchersService.getDispatcher().then(function(results){
         dispatchersVm.dispatcherDetail = results; //jshint ignore:line
      }, ErrorHandlerService.handleCommonErrorGET);
    }

    function showDeleteDispatcher(){
      $ionicLoading.show({template: '{{::("globals.deleting"|translate)}}'});
      DispatchersService.deleteDispatcher(dispatchersVm.dispatcherDetail.id).then(function success(){
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Éxito',
          template: '{{::("dispatchers.dispatchersDelete"|translate)}}'
        });
      },ErrorHandlerService.handleCommonErrorGET);
    }

    function showEditDispatcher(){
      OfficesService.getOffices().then(function success(respuesta){
        dispatchersVm.offices= respuesta.provider_offices; //jshint ignore:line
        dispatchersVm.dispatcher = angular.copy(dispatchersVm.dispatcherDetail);
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/dispatchers/new-edit.html'
        });
      }, ErrorHandlerService.handleCommonErrorGET);
    }

    function submitDispatcher(){
      $ionicLoading.show({template: '{{::("globals.updating"|translate)}}'});
      DispatchersService.updateDispatcher(dispatchersVm.dispatcher).then(function success(resp){
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Éxito',
          template: '{{::("dispatchers.dispatchersUpdate"|translate)}}'
        });
        closeDispatcher();
        dispatchersVm.dispatcherDetail = resp.provider_dispatcher; //jshint ignore:line
      }, function(rpta){
        dispatchersVm.messages = rpta.status===422 ? rpta.data.errors:undefined;
        $ionicLoading.hide();
      });
    }

    function closeDispatcher() {
      ModalService.closeModal();
      dispatchersVm.messages = {};
    }
  }
})();
