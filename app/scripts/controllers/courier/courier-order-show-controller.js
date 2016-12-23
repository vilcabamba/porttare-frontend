(function () {
  'use strict';
  angular
    .module('porttare.controllers')
    .controller('CourierOrderController', CourierOrderController);

  function CourierOrderController(courierOrder,
                                  $ionicLoading,
                                  MapsService,
                                  GeolocationService) {
    var coVm = this,
        currentLocation;
    coVm.order = courierOrder;
    init();

    function init() {
      performing();
      getCurrentPosition();
      MapsService.loadGMaps().then(function(){
        var destino = { address: 'Calle sucre y mercadillo',
                        componentRestrictions: {
                          country: 'EC',
                          locality: 'loja'
                          }
                      };
        var map = MapsService.renderMap('order-map');
        MapsService.renderPosicionActualDestinoMarker(map, destino);
        finishedPerforming();
      });
    }

    function getCurrentPosition(){
      GeolocationService
        .getCurrentPosition()
        .then(function(resp){
          currentLocation = resp;
        }).catch(function (error){
          finishedPerforming();
          $ionicPopup.alert({
            title: 'Error',
            template: error
          });
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
