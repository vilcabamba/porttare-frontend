(function () {
  'use strict';
  angular
    .module('porttare.controllers')
    .controller('CourierOrderController', CourierOrderController);

  function CourierOrderController(courierOrder,
                                  $q,
                                  $ionicLoading,
                                  $ionicPopup,
                                  MapsService,
                                  GeolocationService) {
    var coVm = this,
        currentLocation;
    coVm.order = courierOrder;
    init();

    function init() {
      performing();
      $q.all([
        getCurrentPosition(),
        loadMaps()
      ]).then(function(){
        var map = MapsService.renderMap('order-map');
        MapsService.renderRoute({
          map: map,
          origin: getOrigin(),
          target: getTarget()
        });
        finishedPerforming();
      });
    }

    function getOrigin(){
      return new google.maps.LatLng(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    }

    function getTarget(){
      return new google.maps.LatLng(
        coVm.order.address_attributes.lat, // jshint ignore:line
        coVm.order.address_attributes.lon // jshint ignore:line
      );
    }

    function loadMaps(){
      return MapsService.loadGMaps();
    }

    function getCurrentPosition(){
      return GeolocationService
        .getCurrentPosition()
        .then(function(resp){
          currentLocation = resp;
        }).catch(function (error){
          finishedPerforming();
          $ionicPopup.alert({
            title: 'Error',
            template: error
          });
          return $q.reject(error);
        });
    }

    function performing(){
      $ionicLoading.show({
        template: '{{::(globals.loading|translate)}}'
      });
    }

    function finishedPerforming(){
      $ionicLoading.hide();
    }
  }
})();
