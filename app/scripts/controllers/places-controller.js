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
      if (!$auth.user.current_place && placesVm.places.length>1) { //jshint ignore:line
        $ionicLoading.show({
          template: '{{::("globals.geolocation"|translate)}}'
        });
        GeolocationService.getCurrentPosition().then(function success(resp) {
          selectPlaceDistanciaCorta(resp.coords);
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
      var puntos = [];
      for (var i=0; i<placesVm.places.length; i++){
        var objeto = {latitude: placesVm.places[i].lat,
                      longitude: placesVm.places[i].lon};
        puntos.push(objeto);
      }
      var distancia = geolib.findNearest(position, puntos, 1); //jshint ignore:line
      var attributes = { 'current_place_id' : placesVm.places[distancia.key].id};
      updateUser(attributes).then(function(){
        placesVm.currentPlaceId = getCurrentPlaceId();
        $ionicLoading.hide();
      });
    }

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
