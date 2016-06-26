(function () {
  'use strict';

  describe('ResetController', function () {
    var $rootScope,
        controller,
        deferredReset,
        deferredSendEmail,
        deferPasswordReset,
        $auth,
        $state,
        $ionicPopup,
        deferredStateGo,
        $ionicLoading,
        $window,
        $scope;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
                $rootScope,
                $controller) {

      deferredReset  = $q.defer();
      deferredStateGo   = $q.defer();
      deferredSendEmail     = $q.defer();
      deferPasswordReset= $q.defer();
      $ionicPopup       = {
        alert: sinon.stub(),
        show: sinon.stub().returns(deferredSendEmail.promise)
      };
      $ionicLoading     = { show: sinon.stub(), hide: sinon.stub()};
      $state            = { go: sinon.stub().returns(deferredStateGo.promise),
                            href: sinon.stub().returns('#/app/playlists')};
      $auth             = {
        updatePassword: sinon.stub()
                          .returns(deferredReset.promise),
        requestPasswordReset: sinon.stub()
                          .returns(deferPasswordReset.promise),
      };
      $window           = {
        location: {href: '#/reset'}
      };

      controller = $controller('ResetController', {
        '$ionicPopup': $ionicPopup,
        '$ionicLoading': $ionicLoading,
        '$state': $state,
        '$auth': $auth,
        '$window': $window,
        '$scope': $scope
      });
    }));

    describe('#reset_password', function() {

      beforeEach(inject(function(_$rootScope_) {
        $rootScope = _$rootScope_;
        controller.updatePassword();
      }));

      it('ionicLoading.show should be called', function() {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      describe('#resetPassword', function () {
        beforeEach(inject(function (_$rootScope_) {
          $rootScope = _$rootScope_;
          controller.resetPassword();
        }));

        it('should call resetPassword on authService', function () {
          deferredSendEmail.resolve({ email: 'test1@test.com' });
          $rootScope.$digest();
          sinon.assert.alwaysCalledWithExactly($auth.requestPasswordReset, {
            email: 'test1@test.com'
          });
        });

        describe('when restore password is selected,', function () {
          var successMessage = 'Se enviaron las intrucciones al correo.';

          it('if successful, should show a message', function () {
            deferredSendEmail.promise.then(function () {
              deferPasswordReset.resolve();
            });
            deferredSendEmail.resolve();
            $rootScope.$digest();
            sinon.assert.calledWithMatch($ionicLoading.show, {
              template: successMessage
            });


          });

          it('if unsuccessful, should show an alert', function () {
            deferredSendEmail.promise.then(function () {
              deferPasswordReset.reject();
            });
            deferredSendEmail.resolve();
            $rootScope.$digest();
            sinon.assert.calledOnce($ionicPopup.alert);
          });

        });
      });

      describe('when reset password is executed,', function() {
        var successState = 'app.playlists';

        it('if successful, should change state', function() {
          deferredReset.resolve();
          $rootScope.$digest();
          $rootScope.$emit('auth:password-change-success');
          sinon.assert.alwaysCalledWithExactly($state.href, successState);
          expect($window.location.href).to.equal('/#/app/playlists');
        });

        it('if unsuccessful, should show a popup', function() {
          deferredReset.reject({ errors: [] });
          $rootScope.$digest();
          /*jshint camelcase: false */
          var errors = { errors: {full_messages:['message']} };
          $rootScope.$emit('auth:password-change-error', errors);
          sinon.assert.calledOnce($ionicPopup.alert);
        });
      });
    });
  });
})();
