(function () {
  'use strict';

  describe('ItemsController', function () {
    var ctrl,
      $q,
      $controller,
      dependencies,
      ItemsService,
      deferGetItems,
      ModalService,
      APP,
      $ionicLoading,
      $ionicPopup,
      $scope,
      $rootScope,
      deferNewItem,
      deferEditItem,
      deferIonic,
      ErrorHandlerService,
      deferDeleteItem;

    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.services', function($provide){
      $provide.factory('ItemsService', function($q){
        return {
          getItems: function(){
            deferGetItems = $q.defer();
            return deferGetItems.promise;
          },
          newItem: function(){
            deferNewItem = $q.defer();
            return deferNewItem.promise;
          },
          editItem: function(){
            deferEditItem = $q.defer();
            return deferEditItem.promise;
          },
          deleteItem: function(){
            deferDeleteItem = $q.defer();
            return deferDeleteItem.promise;
          }
        };
      });
      $provide.factory('ModalService', function(){
        return {
          showModal: function(){
            return null;
          },
          closeModal: function(){
            return null;
          }
        };
      });
      APP = {
        centsInDollar: '100'
      };
      ErrorHandlerService = {
        handleCommonErrorGET: sinon.stub()
      };
    }));

    beforeEach(inject(
      function (_$q_,
        _$rootScope_,
        _$controller_,
        _ItemsService_,
        _ModalService_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        deferGetItems = $q.defer();
        deferIonic = $q.defer();
        ItemsService = _ItemsService_;
        ModalService = _ModalService_;
        $controller = _$controller_;
        $ionicLoading = {
          show: sinon.stub().returns(deferIonic.promise),
          hide: sinon.stub().returns(deferIonic.promise)
        };
        $ionicPopup = {
          alert: sinon.stub().returns(deferIonic.promise)
        };
      })
    );

    describe('All functions', function () {
      beforeEach(function () {
        dependencies = {
          $scope: $scope,
          ItemsService: ItemsService,
          ModalService: ModalService,
          $ionicLoading: $ionicLoading,
          $ionicPopup: $ionicPopup,
          ErrorHandlerService: ErrorHandlerService,
          APP: APP
        };

        ctrl = $controller('ItemsController', dependencies);
      });

      describe('Get items list', function () {
        it('Get items list', function () {
          var data = {provider_items: []}; //jshint ignore:line
          deferGetItems.resolve(data);
          $scope.$digest();
          chai.assert.isArray(ctrl.items);
        });

        it('if unsuccessful, ErrorHandlerService should be called', function () {
          var data = {provider_items: []}; //jshint ignore:line
          deferGetItems.reject(data);
          $scope.$digest();
          sinon.assert.calledOnce(ErrorHandlerService.handleCommonErrorGET);
        });
      });

      describe('Create item', function () {

        beforeEach(inject(function () {
          ctrl.item = {};
          ctrl.submitProcess(null);
        }));

        it('ionicLoading.show should be called', function () {
          sinon.assert.calledOnce($ionicLoading.show);
        });

        it('if successful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferNewItem.resolve({data: 'data'});
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });

        it('if successful, response should be added to clients', function () {
          ctrl.items = [];
          deferNewItem.resolve({data: 'data'});
          $scope.$digest();
          expect(ctrl.items).to.not.be.null; //jshint ignore:line
        });

        it('if successful, ionicPopup.alert should be called', function () {
          ctrl.items = [];
          deferNewItem.resolve({data: 'data'});
          deferIonic.resolve();
          $scope.$digest();
          sinon.assert.calledOnce($ionicPopup.alert);
        });

        it('if unsuccessful, ionicLoading.hide should be called', function () {
          ctrl.messages = {};
          var backendErrors = {
            status: 422,
            data: {
              errors: [
                { test: 'message' }
              ]
            }
          };
          deferNewItem.reject(backendErrors);
          $rootScope.$digest();
          expect(ctrl.messages).to.be.not.empty; //jshint ignore:line
        });

        it('if unsuccessful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferNewItem.reject({data: 'data'});
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });
      });

      describe('Edit item', function () {

        beforeEach(inject(function () {
          ctrl.item = {};
          ctrl.submitProcess(1);
        }));

        it('ionicLoading.show should be called', function () {
          sinon.assert.calledOnce($ionicLoading.show);
        });

        it('if successful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferEditItem.resolve({id:0});
          deferEditItem.resolve({data: 'data'});
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });

        it('if successful, ionicPopup.alert should be called', function () {
          ctrl.items = [];
          deferEditItem.resolve({id:0});
          $scope.$digest();
          sinon.assert.calledOnce($ionicPopup.alert);
        });

        it('if unsuccessful, ionicLoading.hide should be called', function () {
          ctrl.messages = {};
          var backendErrors = {
            status: 422,
            data: {
              errors: [
                { test: 'message' }
              ]
            }
          };
          deferEditItem.reject(backendErrors);
          $rootScope.$digest();
          expect(ctrl.messages).to.be.not.empty; //jshint ignore:line
        });

        it('if unsuccessful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferEditItem.reject({data: 'data'});
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });
      });

      describe('Delete item', function () {

        beforeEach(inject(function () {
          ctrl.deleteItem(0);
        }));

        it('ionicLoading.show should be called', function () {
          sinon.assert.calledOnce($ionicLoading.show);
        });

        it('if successful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferDeleteItem.resolve();
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });

        it('if successful, ionicPopup.alert should be called', function () {
          ctrl.items = [];
          deferDeleteItem.resolve();
          $scope.$digest();
          sinon.assert.calledOnce($ionicPopup.alert);
        });

        it('if unsuccessful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferDeleteItem.reject();
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });
      });

      describe('Modal', function () {
        beforeEach(function () {
          dependencies = {
            $scope: $scope,
            ItemsService: ItemsService,
            ModalService: ModalService,
            $ionicLoading: $ionicLoading,
            $ionicPopup: $ionicPopup,
            ErrorHandlerService: ErrorHandlerService,
            APP: APP
          };

          ctrl = $controller('ItemsController', dependencies);
        });

        it('Show modal', function () {
          var spy = sinon.spy(ModalService, 'showModal');
          ctrl.launchModal();
          chai.expect(spy.called).to.be.equal(true);
        });

        beforeEach(inject(function () {
          ctrl.items = [ { id: 0, imagenes: [] }, { id:1 } ];
          ctrl.showEditModal(0);
        }));

        it('Show edit modal', function () {
          var spy = sinon.spy(ModalService, 'showModal');
          ctrl.launchModal();
          chai.expect(spy.called).to.be.equal(true);
          chai.assert.isObject(ctrl.item, 'This is an object!');
        });

        it('Close modal', function () {
          var spy = sinon.spy(ModalService, 'closeModal');
          ctrl.closeModal();
          expect(ctrl.item).to.be.null; //jshint ignore:line
          chai.expect(spy.called).to.be.equal(true);
        });
      });
    });
  });
})();
