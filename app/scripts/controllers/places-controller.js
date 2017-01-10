(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('PlacesController', PlacesController);

  function PlacesController(places,
                            $state,
                            $auth,
                            $ionicLoading,
                            $ionicHistory,
                            APP,
                            CartService,
                            UserAccountService,
                            ErrorHandlerService) {
    var placesVm = this;
    placesVm.places = places;
    placesVm.selectPlace = selectPlace;
    placesVm.currentPlaceId = getCurrentPlaceId();

    function selectPlace(placeId){
      var attributes = { 'current_place_id' : placeId }; //jshint ignore:line
      performing();
      updateUser(attributes).then(function(){
        updateCart().then(finishedPerforming).then(function(){
          nextViewIsRootView();
          $state.go(APP.successState);
        });
      });
    }

    function performing(){
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });
    }

    function finishedPerforming(){
      return $ionicLoading.hide();
    }

    function getCurrentPlaceId(){
      return $auth.user.current_place && $auth.user.current_place.id; // jshint ignore:line
    }

    function updateUser(attributes){
      return UserAccountService
               .updateUser(attributes)
               .then(function (resp) {
                 $auth.user = resp.data;
               })
               .catch(ErrorHandlerService.handleCommonErrorGET);
    }

    function updateCart(){
      return CartService.getCart().then(function(resp){
        $auth.user.customer_order = resp.customer_order; // jshint ignore:line
      });
    }

    function nextViewIsRootView(){
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
    }
  }
})();
