(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('PlacesController', PlacesController);

  function PlacesController(places,
                            $state,
                            $auth,
                            $ionicLoading,
                            $ionicPopup,
                            $ionicHistory,
                            APP,
                            CartService,
                            UserAccountService,
                            GeolocationService,
                            ErrorHandlerService) {
    var placesVm = this;
    placesVm.places = places;
    placesVm.selectPlace = selectPlace;
    placesVm.currentPlaceId = getCurrentPlaceId();
    geolocalizacion();

    function geolocalizacion(){
      if (!$auth.user.current_place) { //jshint ignore:line
        $ionicLoading.show({
          template: '{{::("globals.geolocation"|translate)}}'
        });
        GeolocationService.getCurrentPosition().then(function success(resp) {
          var position = {latitude: resp.coords.latitude,
                          longitude: resp.coords.longitude};
          selectPlaceDistanciaCorta(position);
        },function (error) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: error
          });
        });
      }
    }

    function selectPlaceDistanciaCorta(position){
      var objeto = placesVm.places.reduce(function (objeto, item){
        item.latitude = item.lat;
        item.longitude = item.lon;
        objeto[item.id]=item;
        return objeto;
      }, {});
      var limit = placesVm.places.length===1 ? 0:1;
      var distancia = geolib.findNearest(position, objeto, limit);
      var attributes = { 'current_place_id' : distancia.key};
      updateUser(attributes).then(function(){
        placesVm.currentPlaceId = getCurrentPlaceId();
        $ionicLoading.hide();
      });
    }

    function selectPlace(placeId){
      if (placeId !== placesVm.currentPlaceId){
        var attributes = { 'current_place_id' : placeId }; //jshint ignore:line
        performing();
        updateUser(attributes).then(function(){
          updateCart().then(finishedPerforming).then(function(){
            nextViewIsRootView();
            $state.go(APP.successState);
          });
        });
      }else{
        nextViewIsRootView();
        $state.go(APP.successState);
      }
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
