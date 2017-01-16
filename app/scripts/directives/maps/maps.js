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
        lon: '=',
        referencia: '=',
        direccion:'=',
        direccionDos: '=',
        geolocationMessageKey: '=',
        defaultInCurrentGeolocation: '='
      },
      controller: [ '$scope',
                    'MapsService',
                    'GeocodingService',
                    'GeolocationService',
                    mapsController],
      controllerAs: 'mapVm',
      bindToController: true
    };

    return directive;
  }

  function mapsController($scope,
                          MapsService,
                          GeocodingService,
                          GeolocationService) {
    var mapVm = this, // jshint ignore:line
        shouldGeocodeMarkerPosition;

    init();

    function init(){
      shouldGeocodeMarkerPosition = angular.element.isEmptyObject(
        angular.element.trim(mapVm.direccion)
      );

      mapVm.geolocationMessageKey = 'maps.loading';

      MapsService.loadGMaps().then(function () {
        mapVm.geolocationMessageKey = null;
        drawMap();
        listenForChange();
        if (mapVm.defaultInCurrentGeolocation) {
          GeolocationService
            .getCurrentPosition()
            .then(function (position){
              drawMakerFromGeoPosition(position);
              geocodeCurrentPosition();
            }).catch(couldntGetPosition);
        } else {
          drawMakerFromGeoPosition({
            coords: {
              latitude: mapVm.lat,
              longitude: mapVm.lon
            }
          });
        }
      });
    }

    function drawMap(){
      mapVm.map = MapsService.renderMap('map-directive');
    }

    function drawMakerFromGeoPosition(position){
      var positionLatLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      return drawMarker(positionLatLng);
    }

    function drawMarker(positionLatLng){
      mapVm.map.panTo(positionLatLng);
      mapVm.currentMarker = MapsService.displayMarker(
        mapVm.map,
        positionLatLng
      );
    }

    function couldntGetPosition(message) {
      mapVm.mapError = message;
    }

    function listenForChange(){
      mapVm.map.addListener('click', function (changeEvent) {
        clearErrorMessages();
        clearCurrentMarker();
        drawMarker(changeEvent.latLng);

        $scope.$apply(function(){
          mapVm.lat = mapVm.currentMarker.getPosition().lat();
          mapVm.lon = mapVm.currentMarker.getPosition().lng();
        });

        if (shouldGeocodeMarkerPosition) {
          geocodeCurrentPosition();
        }
      });
    }

    function geocodeCurrentPosition(){
      mapVm.geolocationMessageKey = 'maps.geocoding';
      GeocodingService
        .geocode({'latLng': mapVm.currentMarker.getPosition()})
        .then(function(results){
          mapVm.geolocationMessageKey = 'maps.geocoded';
          // jshint ignore:start
          mapVm.direccion = results[0].formatted_address;
          mapVm.direccionDos = results[1].formatted_address;
          // jshint ignore:end
          mapVm.referencia = getReferencia(results[0]);
        })
        .catch(function(error){
          if (error === 'OVER_QUERY_LIMIT') {
            mapVm.geolocationMessageKey = 'maps.overGeocodeLimit';
          } else {
            mapVm.geolocationMessageKey = 'maps.wontGeocode';
            console.error(error);
          }
        });
    }

    function clearErrorMessages(){
      mapVm.mapError = null;
    }

    function clearCurrentMarker(){
      if (mapVm.currentMarker) {
        mapVm.currentMarker.setMap(null);
        mapVm.currentMarker = null;
      }
    }

    function getReferencia(geolocationResult){
      var components = geolocationResult.address_components; //jshint ignore:line
      var cityComponent = components.find(function(component){
        return component.types.includes('political');
      });
      return cityComponent && cityComponent.long_name; // jshint ignore:line
    }
  }
})();
