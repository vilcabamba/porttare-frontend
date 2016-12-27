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
    mapVm.disableTap = disableTap;

    mapVm.defaultInCurrentGeolocation ? showGMap() : showGMapUpdate();// jshint ignore:line

    function showGMap() {
      $ionicLoading.show({
        template: 'cargando...'
      });
      MapsService.loadGMaps().then(function(){
        GeolocationService.getCurrentPosition()
          .then(
            function onSuccess(position) {
              var map = loadMap(position, true);
              loadPlacesSearchBox(map);
              $ionicLoading.hide();
            },
            function onError(err) {
              $ionicLoading.hide();
              var message = null;
              var defaultPosition = {
                coords: {
                  latitude: null,
                  longitude: null
                }
              };

              if (!err && !err.code) {
                showUnknownError();
                return;
              }

              switch (err.code) {
                case 1:
                  message = 'Denegada la peticion de Geolocalización.';
                  break;
                case 2:
                  message = 'No se ha encontrado la ubicación especificada.';
                  break;
                case 3:
                  message = 'El tiempo de petición ha expirado.';
                  break;
              }

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
        var map = loadMap(position, true);
        loadPlacesSearchBox(map);
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
      var map = loadMap(position, useMarker);
      loadPlacesSearchBox(map);
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

      var map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Only when the Geolocation is active
      if (useMarker) {
        new google.maps.Marker({
          position: latLng,
          map: map
        });
      }
      return map;
    }

    function loadPlacesSearchBox(map) {
      var input = document.getElementById('input-places');
      var placesSearchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      var markers = [];

      placesSearchBox.addListener('places_changed', function () {
        var places = placesSearchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });

      listenerClick(map, markers);
    }

    function listenerClick(map, markers){
      map.addListener('click', function (e) {
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];
        addMarker(e.latLng);
      });

      function addMarker(latLng){
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        });
        markers.push(marker);
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

    function disableTap() {
      var container = document.getElementsByClassName('pac-container');
      angular.element(container).attr('data-tap-disabled', 'true');
      angular.element(container).on('click', function(){
        document.getElementById('input-places').blur();
      });
    }
  }
})();
