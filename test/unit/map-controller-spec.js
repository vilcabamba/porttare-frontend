(function () {
  'use strict';

  describe('MapController', function () {
    var $rootScope,
      controller,
      deferredGeolocation,
      $ionicPopup,
      GeolocationService,
      $ionicLoading;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
        $rootScope,
        $controller) {
        deferredGeolocation = $q.defer();
        $ionicPopup = { alert: sinon.stub() };
        $ionicLoading = { show: sinon.stub(), hide: sinon.stub() };
        GeolocationService = { getCurrentPosition: sinon.stub().returns(deferredGeolocation.promise) };
        window.google = {
          maps: {
            MapTypeId: {
              ROADMAP: 'ROADMAP'
            },
            LatLng: function (lat, lng) {
              return {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),

                lat: function () { return this.latitude; },
                lng: function () { return this.longitude; }
              };
            },
            Marker: function () {
              return {};
            },
            Map: function () {
              return {
                controls: {
                  TOP_CENTER: []
                }
              };
            },
            ControlPosition: {
              TOP_CENTER: 'TOP_CENTER',
            },
            MapTypeControlStyle: {
              VERTICAL_BAR: 'VERTICAL_BAR'
            },
            places: {
              SearchBox: function () {
                return {
                  addListener: function () {return true;}
                };
              }
            }
          }
        };

        controller = $controller('MapController', {
          '$ionicPopup': $ionicPopup,
          '$ionicLoading': $ionicLoading,
          'GeolocationService': GeolocationService
        });
      }));

    describe('#geolocation map', function () {

      beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
      }));

      it('ionicLoading.show should be called', function () {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      describe('when MapController is loaded', function () {

        it('if successful, should create map', function () {
          var spyMap = sinon.spy(window.google.maps, 'Map');
          var spySB = sinon.spy(window.google.maps.places, 'SearchBox');
          deferredGeolocation.resolve({
            coords:
            {
              latitude: -3.9866901,
              longitude: -79.19683399999997
            }
          });
          $rootScope.$digest();
          sinon.assert.calledOnce(GeolocationService.getCurrentPosition);
          expect(spyMap.calledOnce).to.be.true;
          expect(spySB.calledOnce).to.be.true;
        });

        it('if unsuccessful, should show a popup', function () {
          deferredGeolocation.reject();
          $rootScope.$digest();
          sinon.assert.calledOnce(GeolocationService.getCurrentPosition);
          sinon.assert.calledOnce($ionicPopup.alert);
        });
      });
    });
  });
})();
