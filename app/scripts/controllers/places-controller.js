(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('PlacesController', PlacesController);

  function PlacesController(places,
                            $state,
                            APP,
                            $ionicLoading,
                            $ionicPopup,
                            $auth,
                            UserAccountService,
                            ErrorHandlerService) {
    var placesVm = this;
    placesVm.places=places;
    placesVm.selectPlace = selectPlace;

    function selectPlace(placeId){
      var user = { 'current_place_id' : placeId }; //jshint ignore:line
      $ionicLoading.show({template: '{{::("globals.updating"|translate)}}'});
      UserAccountService.updateUser(user).then(function success(resp){
        $ionicLoading.hide().then(function(){
          $auth.user.current_place = resp.data.current_place; //jshint ignore:line
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("places.placeAssignedUser"|translate)}}'
          }).then(function(){
            $state.go(APP.successState);
          });
        });
      }, ErrorHandlerService.handleCommonErrorGET);
    }
  }
})();
