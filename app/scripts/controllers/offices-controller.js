(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('OfficesController', OfficesController);

  function OfficesController(OfficesService,
                              ModalService,
                              ErrorHandlerService,
                              $ionicLoading,
                              $ionicPopup,
                              $scope) {

    var officesVm = this;
    officesVm.showNewOffice = showNewOffice;
    officesVm.closeModal = closeModal;
    officesVm.submitOffice = submitOffice;
    getOffices();

    function getOffices() {
      OfficesService.getOffices().then(function(results){
        officesVm.offices = results.provider_offices; //jshint ignore:line
      }, ErrorHandlerService.handleCommonErrorGET);
    }

    function showNewOffice() {
      officesVm.office = {};
      officesVm.office.enabled = false;
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/offices/new-edit.html'
      });
    }

    function closeModal() {
      ModalService.closeModal();
      officesVm.messages = {};
    }

    function submitOffice(){
      if(officesVm.form.$valid){
        $ionicLoading.show({
          template: '{{::("globals.saving"|translate)}}'
        });
        OfficesService.createOffice(officesVm.office).then(function success(resp){
          $ionicLoading.hide().then(function(){
            officesVm.offices.push(resp.provider_office); //jshint ignore:line
            $ionicPopup.alert({
              title: 'Éxito',
              template: '{{::("office.officeSuccessSave"|translate)}}'
            }).then(function(){
              closeModal();
            });
          });
        }, function(response){
          officesVm.messages = response.status===422 ? response.data.errors:undefined;
          $ionicLoading.hide();
        });
      }
    }
  }
})();
