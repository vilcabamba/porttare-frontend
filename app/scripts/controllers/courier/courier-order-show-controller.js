(function () {
  'use strict';
  angular
    .module('porttare.controllers')
    .controller('CourierOrderController', CourierOrderController);

  function CourierOrderController(courierOrder,
                                  $q,
                                  $scope,
                                  $ionicLoading,
                                  $ionicPopup,
                                  MapsService,
                                  GeolocationService,
                                  ShippingRequestService) {
    var coVm = this,
        currentLocation;
    coVm.order = courierOrder;
    coVm.showTakeRequestModal = showTakeRequestModal;
    coVm.courierIsInStore = courierIsInStore;
    coVm.courierHasDelivered = courierHasDelivered;
    init();

    function init() {
      preloadShippingRequestData();
      performing();
      $q.all([
        loadMaps(),
        getCurrentPosition()
      ]).then(function(){
        var map = MapsService.renderMap('order-map');
        MapsService.renderRoute({
          map: map,
          origin: getOrigin(),
          target: getTarget(),
          waypoints: getWaypoints(),
        });
        finishedPerforming();
      });
    }

    function preloadShippingRequestData() {
      coVm.address = coVm.order.address_attributes; // jshint ignore:line
      coVm.provider = coVm.order.provider_profile; // jshint ignore:line
      coVm.shouldDisplayClientDetails = getShouldDisplayClientDetails();
      coVm.orderItemsTotal = getOrderItemsTotal();
      // jshint ignore:start
      if (coVm.order.customer_order) {
        coVm.fareCurrency = coVm.order.customer_order.subtotal_items_currency;
        coVm.billingAddress = coVm.order.customer_order.customer_billing_address;

      }
      if (coVm.order.customer_order_delivery) {
        coVm.fareCurrencyCents = coVm.order.customer_order_delivery.shipping_fare_price_cents;
      }
      // jshint ignore:end
    }

    function getOrderItemsTotal() {
      // jshint ignore:start
      var customerOrderItems = coVm.order.customer_order.customer_order_items;
      return customerOrderItems.reduce(function(memo, orderItem){
        var subtotalOrderItem = orderItem.cantidad * orderItem.provider_item_precio_cents;
        return memo + subtotalOrderItem;
      }, 0);
      // jshint ignore:end
    }

    function getShouldDisplayClientDetails(){
      return coVm.order.customer_order_delivery && coVm.order.status !== 'new'; // jshint ignore:line
    }

    function getWaypoints(){
      if (!coVm.order.waypoints) { return; }
      return coVm.order.waypoints.map(function(waypoint){
        var location = new google.maps.LatLng(
          waypoint.lat,
          waypoint.lon
        );
        return {
          stopover: true,
          location: location
        };
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
          coVm.mapIsHidden = true;
          return $q.reject(error);
        });
    }

    function performing(){
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
    }

    function finishedPerforming(){
      $ionicLoading.hide();
    }

    function showTakeRequestModal(){
      // TODO translate me?
      $ionicPopup.show({
        scope: $scope,
        template: '<input type="number" ng-model="coVm.takeRequestTime" min="0" placeholder="Tiempo en minutos">',
        title: 'Tiempo estimado para la entrega',
        subTitle: 'incluye el tiempo que tomará recoger el pedido',
        buttons: [
          { text: 'Cancelar',
            onTap: function(){
              coVm.takeRequestTime = null;
            }
          },
          {
            text: 'Confirmar',
            type: 'button-positive',
            onTap: function(e) {
              if (!coVm.takeRequestTime) {
                e.preventDefault();
              } else {
                performTakeRequest();
              }
            }
          }
        ]
      });
    }

    function performTakeRequest(){
      performing();
      ShippingRequestService.takeShippingRequest(
        coVm.order,
        coVm.takeRequestTime
      ).then(successFromShippingRequestService)
      .finally(finishedPerforming);
    }

    function courierIsInStore(){
      performing();
      ShippingRequestService.courierIsInStore(
        coVm.order
      ).then(successFromShippingRequestService)
      .finally(finishedPerforming);
    }

    function courierHasDelivered(){
      performing();
      ShippingRequestService.courierHasDelivered(
        coVm.order
      ).then(successFromShippingRequestService)
      .finally(finishedPerforming);
    }

    function successFromShippingRequestService(respShippingReq){
      coVm.order = respShippingReq;
      init();
    }
  }
})();
