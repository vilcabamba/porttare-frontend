(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('MapsService', MapsService);

  function MapsService($q,
                       $auth,
                       $window,
                       $ionicPopup,
                       GeocodingService,
                       ENV) {
    var service = {
      loadGMaps: loadGMaps,
      renderMap: renderMap,
      displayMarker: displayMarker,
      renderRoute: renderRoute
    };
    var loadDefered,
        gmapsLoaded;

    return service;

    function loadGMaps() {
      if (gmapsLoaded) {
        return $q.resolve();
      } else {
        loadDefered = $q.defer();
        appendGMapsScript();
        return loadDefered.promise;
      }
    }

    function appendGMapsScript() {
      $window.gMapsCallback = function() { gMapsCallback(); };
      var libraries = 'places';
      var gMapsUrl = '//maps.google.com/maps/api/js?libraries=' + libraries + '&callback=gMapsCallback&key=';
      var script = document.createElement('script');
      script.src = gMapsUrl + ENV.gMapsKey;
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    function gMapsCallback(){
      gmapsLoaded = true;
      loadDefered.resolve();
      removeGMapsCallback();
    }

    function removeGMapsCallback(){
      delete $window.gMapsCallback;
    }

    function renderMap(domId) {
      return new google.maps.Map(
        document.getElementById(domId),
        mapOptionsDefault()
      );
    }

    // function getGeocoderLocation(options){
    //   var defered = $q.defer();
    //   var geocoder = new google.maps.Geocoder();
    //   var posicion;
    //   geocoder.geocode(options, function success(results, status) {
    //     if (status === 'OK') {
    //       posicion = results[0].geometry.location;
    //     } else {
    //       posicion = mapPositionDefault();
    //       $ionicPopup.alert({
    //         title: 'Error',
    //         template: 'No se ha encontrado la dirección' + options.address
    //       });
    //     }
    //     defered.resolve(posicion);
    //   });
    //   return defered.promise;
    // }

    // function renderPosicionActualDestinoMarker(map, destinoOptions){
    //   var origen;
    //   var destino;
    //   GeolocationService.getCurrentPosition().then(function onSuccess(respuesta) {
    //         origen = respuesta;
    //         getGeocoderLocation(destinoOptions).then(function success(respuesta){
    //           destino = respuesta;
    //           renderOrigenDestinoMarker(map, origen, destino);
    //         });
    //       }, function onError(err) {
    //         origen =  mapPositionDefault();
    //         getGeocoderLocation(destinoOptions).then(function success(respuesta){
    //           destino = respuesta;
    //           renderOrigenDestinoMarker(map, origen, destino);
    //         });
    //         $ionicPopup.alert({
    //           title: 'Error',
    //           template: 'No se ha encontrado su ubicación actual: ' + err.message
    //         });
    //   });
    // }

    function renderRoute(options){
      var map = options.map,
          origin = options.origin,
          target = options.target;
      renderOrigenDestinoMarker(map, origin, target);
    }

    function renderOrigenDestinoMarker(map, origen, destino){
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();
      directionsDisplay.setMap(map);
      directionsService.route({
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true
      }, function(response, status) {
        if (status === 'OK') {
          console.log(response);
          directionsDisplay.setDirections(response);
          var myRoute = response.routes[0].legs[0];
          for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = new google.maps.Marker({
              position: myRoute.steps[i].end_location, //jshint ignore:line
              map: map,
              visible: i+1 == myRoute.steps.length ? true : false //jshint ignore:line
            });
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent("<b>"+ myRoute.steps[i].duration.text + "</b><br>" + myRoute.steps[i].distance.text); //jshint ignore:line
            infoWindow.open(map,marker);
          }

        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: 'No se ha podido cargar la ruta' + status
          });
        }
      });
    }

    // function renderAddressMarker(map, options) {
    //   var geocoder = new google.maps.Geocoder();
    //   geocoder.geocode(options, function(results, status) {
    //     if (status === 'OK') {
    //       map.setCenter(results[0].geometry.location);
    //       displayMarker(map, results[0].geometry.location);
    //     } else {
    //       var positionDefault = mapPositionDefault();
    //       map.setCenter(positionDefault);
    //       $ionicPopup.alert({
    //         title: 'Error',
    //         template: '{{::("office.locationNotFound"|translate)}}' + options.address
    //       });
    //     }
    //   });
    // }

    function displayMarker(map, marker){
      return new google.maps.Marker({
        map: map,
        position: marker
      });
    }

    function mapOptionsDefault(){
      return {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        disableDefaultUI: true,
        center: mapPositionDefault()
      };
    }

    function mapPositionDefault(){
      var currentPlace = $auth.user.current_place; // jshint ignore:line
      return new google.maps.LatLng(currentPlace.lat, currentPlace.lon);
    }

  }
})();
