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
                    'GeolocationService',
                    'MapsService', mapsController],
      controllerAs: 'mapVm',
      bindToController: true
    };

    return directive;
  }

  function mapsController($ionicPopup,
                          $ionicLoading,
                          GeolocationService,
                          MapsService)
  {

    var mapVm = this;// jshint ignore:line

    mapVm.defaultInCurrentGeolocation ? showGMap() : showGMapUpdate();// jshint ignore:line

    function showGMap() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      MapsService.loadGMaps().then(function(){
        GeolocationService.getCurrentPosition()
          .then(
            function onSuccess(position) {
              loadMap(position, true);
              listenerClick();
              $ionicLoading.hide();
            },
            function onError(message) {
              $ionicLoading.hide();
              var defaultPosition = {
                coords: {
                  latitude: null,
                  longitude: null
                }
              };
              if (!message) {
                showUnknownError();
              } else {
                handleLocationError(message, defaultPosition, false);
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

    function handleLocationError(message, position, useMarker) {
      loadMap(position, useMarker);
      listenerClick();
      $ionicPopup.alert({
        title: 'Error',
        template: message
      });
    }

    function loadMap(position, useMarker) {
      // TODO use MapsService
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      var latLng = new google.maps.LatLng(lat, long);

      var mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.VERTICAL_BAR,
          position: google.maps.ControlPosition.LEFT_BOTTOM
        }
      };

      mapVm.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Only when the Geolocation is active
      if (useMarker) {
        new google.maps.Marker({
          position: latLng,
          map: mapVm.map
        });
      }
      return mapVm.map;
    }

    function listenerClick(){
      mapVm.map.addListener('click', function (e) {
        mapVm.markers.forEach(function (marker) {
          marker.setMap(null);
        });
        mapVm.markers = [];
        addMarker(e.latLng);
      });

      function addMarker(latLng){
        var marker = new google.maps.Marker({
          position: latLng,
          map: mapVm.map
        });
        mapVm.markers.push(marker);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': marker.position}, function(results, status) {
          if(status === google.maps.GeocoderStatus.OK){
            mapVm.direccion = results[0].formatted_address;// jshint ignore:line
            mapVm.ciudad = results[1].formatted_address;// jshint ignore:line
          }
        });
        mapVm.lat = marker.getPosition().lat();
        mapVm.lng = marker.getPosition().lng();
      }
    }
  }
})();
