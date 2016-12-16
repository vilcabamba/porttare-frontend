(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderItemController', ProviderItemController);

  function ProviderItemController($scope,
                                  $state,
                                  $filter,
                                  $timeout,
                                  $translate,
                                  $ionicPopup,
                                  $ionicLoading,
                                  $ionicScrollDelegate,
                                  apiResources,
                                  ModalService,
                                  ItemsService) {
    var providerItemVm = this,
        modalScope,
        productScope;

    providerItemVm.providerItem = apiResources.provider_item;  // jshint ignore:line
    providerItemVm.updateStock = updateStock;
    providerItemVm.showEditModal = launchModal;
    providerItemVm.unregisterItem = unregisterItem;
    providerItemVm.seeAsCustomer = seeAsCustomer;
    providerItemVm.slickSettings = {
      dots: true,
      lazyLoad: 'progressive'
    };

    init();

    function init() {
      providerItemVm.imagesLoaded = true;
      providerItemVm.providerItem.precio = $filter('priceCurrency')(
        providerItemVm.providerItem.precio_cents // jshint ignore:line
      );
    }

    function updateStock() {
      ItemsService.editItem({
        id: providerItemVm.providerItem.id,
        en_stock: providerItemVm.providerItem.en_stock // jshint ignore:line
      }).then(function (response) {
        providerItemVm.providerItem = response.provider_item; // jshint ignore:line
        init();
      });
    }

    function loadImagesUrls() {
      return modalScope.modalVm.item.imagenes.map(function(imagen) {
        if (imagen.constructor === File) {
          return imagen;
        } else if (imagen.constructor === Object) {
          return imagen.imagen_url; // jshint ignore:line
        }
      });
    }

    function concatImages(files) {
      modalScope.modalVm.item.imagenes = modalScope.modalVm.item.imagenes.concat(files);
      modalScope.modalVm.imagesUrls = loadImagesUrls();
    }

    function launchModal() {
      modalScope = $scope.$new(true); // isolated
      modalScope.modalVm = providerItemVm;
      // unfortunately item is the providerItem we'll edit
      modalScope.modalVm.item = angular.copy(providerItemVm.providerItem);
      modalScope.modalVm.closeModal = closeModal;
      modalScope.modalVm.submitProcess = editItem;
      modalScope.modalVm.concatImages = concatImages;
      modalScope.modalVm.imagesUrls = loadImagesUrls();
      ModalService.showModal({
        parentScope: modalScope,
        fromTemplateUrl: 'templates/item/new-edit.html'
      });
    }

    function closeModal() {
      ModalService.closeModal();
      providerItemVm.messages = {};
      providerItemVm.item = null;
    }

    function editItem() {
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });
      providerItemVm.imagesLoaded = false;
      ItemsService.editItem(modalScope.modalVm.item).then(function success(resp) {
        providerItemVm.imagesLoaded = true;
        providerItemVm.providerItem = resp.provider_item; //jshint ignore:line
        init();

        $ionicLoading.hide().then(function () {
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("item.successUpdateItem"|translate)}}'
          }).then(closeModal);
        });
      }, error);
    }

    function error(resp){
      providerItemVm.imagesLoaded = true;
      modalScope.modalVm.messages = resp.status===422 ? resp.data.errors:undefined;
      $ionicLoading.hide();
    }

    function seeAsCustomer() {
      productScope = $scope.$new(true);
      productScope.productVm = {
        more: false,
        disableInputs: true,
        closeModal: closeModal,
        toggleShow: toggleShow,
        product: providerItemVm.providerItem,
        slickConfig: providerItemVm.slickSettings
      };
      ModalService.showModal({
        parentScope: productScope,
        focusFirstInput: false,
        fromTemplateUrl: 'templates/item/as-customer.html'
      });
    }

    function toggleShow(){
      // TODO should be a directive?
      productScope.productVm.more = !productScope.productVm.more;
      $timeout(function(){
        $ionicScrollDelegate.resize();
      }, 250); // animation length is 0.2s
    }

    function unregisterItem() {
      $translate('globals.confirmTitle').then(function (confirmationTitle) {
        $ionicPopup.confirm({
          title: confirmationTitle,
          template: '{{::("item.confirmUnregisterItem"|translate)}}'
        }).then(function(confirmed) {
          if (confirmed) {
            $ionicLoading.show({
              template: '{{::("globals.deleting"|translate)}}'
            });
            ItemsService.deleteItem(providerItemVm.providerItem.id).then(function success(){
              $ionicLoading.hide();
              $state.go('provider.items.index');
            }, function error(){
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: 'Error',
                template: '{{::("globals.pleaseTryAgain"|translate)}}'
              });
            });
          }
        });
      });
    }
  }
})();
