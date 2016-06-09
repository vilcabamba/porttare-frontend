(function () {
  'use strict';

  describe('RegisterController', function () {
    var $rootScope,
        controller,
        deferredRegister,
        $auth,
        $state,
        $ionicPopup,
        deferredStateGo,
        $ionicLoading;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
                $rootScope,
                $controller) {

      deferredRegister  = $q.defer();
      deferredStateGo   = $q.defer();
      $ionicPopup       = { alert: sinon.stub() };
      $ionicLoading     = { show: sinon.stub(), hide: sinon.stub()};
      $state            = { go: sinon.stub().returns(deferredStateGo.promise) };
      $auth             = {
        submitRegistration: sinon.stub()
                          .returns(deferredRegister.promise)
      };

      controller = $controller('RegisterController', {
        '$ionicPopup': $ionicPopup,
        '$ionicLoading': $ionicLoading,
        '$state': $state,
        '$auth': $auth
      });
    }));

    describe('#register', function() {

      beforeEach(inject(function(_$rootScope_) {
        $rootScope = _$rootScope_;
        controller.register();
      }));

      it('ionicLoading.show should be called', function() {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      describe('when the register is executed,', function() {
        var successState = 'login';

        it('if successful, should change state', function() {
          deferredRegister.resolve();
          $rootScope.$digest();

          sinon.assert.alwaysCalledWithExactly($state.go, successState);

          deferredStateGo.resolve();
          $rootScope.$digest();
          sinon.assert.calledOnce($ionicPopup.alert);
        });

        it('if unsuccessful, should show a popup', function() {
          deferredRegister.reject({ errors: [] });
          $rootScope.$digest();

          sinon.assert.calledOnce($ionicPopup.alert);
        });
      });
    });
  });
})();
