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
        defaultInCurrentGeolocation: '=',
        direccion:'=',
        ciudad:'='
      },
      controller: [ '$scope',
                    '$ionicPopup',
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
                          $ionicPopup,
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

      MapsService.loadGMaps().then(function () {
        drawMap();
        listenForChange();
        if (mapVm.defaultInCurrentGeolocation) {
          GeolocationService.getCurrentPosition()
                            .then(drawMakerFromGeoPosition)
                            .catch(couldntGetPosition);
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
      $ionicPopup.alert({
        title: 'Error',
        template: message
      });
    }

    function listenForChange(){
      mapVm.map.addListener('click', function (changeEvent) {
        clearCurrentMarker();
        drawMarker(changeEvent.latLng);

        $scope.$apply(function(){
          mapVm.lat = mapVm.currentMarker.getPosition().lat();
          mapVm.lon = mapVm.currentMarker.getPosition().lng();
        });

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
