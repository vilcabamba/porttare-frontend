(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('maps', maps);

  function maps() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/maps/maps.html',
      scope: {
        lat: '=',
        lng: '=',
        defaultInCurrentGeolocation: '=',
        direccion:'=',
        ciudad:'='
      },
      controller: [ '$ionicPopup',
                    '$ionicLoading',
                    'MapsService',
                    'GeocodingService',
                    'GeolocationService',
                    mapsController],
      controllerAs: 'mapVm',
      bindToController: true
    };

    return directive;
  }

  function mapsController($ionicPopup,
                          $ionicLoading,
                          MapsService,
                          GeocodingService,
                          GeolocationService)
  {

    var mapVm = this, // jshint ignore:line
        shouldGeocodeMarkerPosition;

    init();

    //  ? showGMap() : showGMapUpdate();// jshint ignore:line

    function init(){
      shouldGeocodeMarkerPosition = angular.element.isEmptyObject(
        angular.element.trim(mapVm.direccion)
      );

      MapsService.loadGMaps().then(function () {
        drawMap();
        listenForChange();
        if (mapVm.defaultInCurrentGeolocation) {
          GeolocationService.getCurrentPosition()
                            .then(drawMakerFromGeoPosition)
                            .catch(couldntGetPosition);
        } else {

        }
      });
    }

    function drawMap(){
      mapVm.map = MapsService.renderMap('map-directive');
    }

    function drawMakerFromGeoPosition(position){
      return new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
    }

    function drawMarker(positionLatLng){
      mapVm.currentMarker = MapsService.displayMarker(
        mapVm.map,
        positionLatLng
      );
    }

    function couldntGetPosition(message) {
      $ionicPopup.alert({
        title: 'Error',
        template: message
      });
    }

    function showGMap() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      MapsService.loadGMaps().then(function(){
        GeolocationService.getCurrentPosition()
          .then(
            function onSuccess(position) {
              loadMap(position);
              addMarker(mapVm.latLng);
              listenerClick();
              $ionicLoading.hide();
            },
            function onError(message) {
              $ionicLoading.hide();
              if (!message) {
                showUnknownError();
              } else {
                handleLocationError(message);
              }
            }
          );
      });
    }

    function showGMapUpdate(){
      $ionicLoading.show({
        template: 'cargando...'
      });
      var position={
        coords:{
          latitude:mapVm.lat,
          longitude:mapVm.lng
        }
      };
      MapsService.loadGMaps().then(function(){
        loadMap(position, true);
        listenerClick();
        $ionicLoading.hide();
      });
    }

    function showUnknownError() {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Hubo un error desconocido al cargar el mapa.'
      });
    }

    function handleLocationError(message) {
      // loadMap();
      // listenerClick();

    }

    function loadMap(position) {
      // TODO use MapsService
      if(!position){
        mapVm.latLng = new google.maps.LatLng();
      }
      else{
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        mapVm.latLng = new google.maps.LatLng(lat, long);
      }



      return mapVm.map;
    }

    function listenForChange(){
      mapVm.map.addListener('click', function (changeEvent) {
        clearCurrentMarker();
        drawMarker(changeEvent.latLng);

        mapVm.lat = mapVm.currentMarker.getPosition().lat();
        mapVm.lng = mapVm.currentMarker.getPosition().lng();

        if (shouldGeocodeMarkerPosition) {
          GeocodingService
            .geocode({'latLng': mapVm.currentMarker.getPosition()})
            .then(function(results){
              mapVm.direccion = results[0].formatted_address; // jshint ignore:line
              mapVm.ciudad = results[1].formatted_address; // jshint ignore:line
            });
        }
      });
    }

    function clearCurrentMarker(){
      if (mapVm.currentMarker) {
        mapVm.currentMarker.setMap(null);
        mapVm.currentMarker = null;
      }
    }
  }
})();
