(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProductController', ProductController);

  function ProductController(data, CartService, $ionicPopup, $state) {
    var productVm = this;
    productVm.more = false;
    productVm.toggleShow = toggleShow;
    productVm.product = data;
    productVm.addToCart = addToCart;
    productVm.item = {};
    productVm.item.provider_item_id = productVm.product.id; //jshint ignore:line
    productVm.item.cantidad = 0;

    productVm.options = {
      priceCents: data.precio_cents, // jshint ignore:line
      onChangeValue: function(data) {
        productVm.item.cantidad = data.itemsCount;
      }
    };

    productVm.slickConfig = {
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false
    };

    function toggleShow() {
      productVm.more = !productVm.more;
    }

    function addToCart(){
      CartService.addItem(productVm.item).then(function(){
        var params = {
          categoryId: $state.params.categoryId,
          providerId: $state.params.providerId
        };
        $state.go('app.categories.provider', params).then(function(){
          $ionicPopup.alert({
            title: 'Alerta',
            template: '{{::("cart.successfullyAdded"|translate)}}'
          });
        });
      }, function(){
        $ionicPopup.alert({
          title: 'Error',
          template: '{{::("globals.pleaseTryAgain"|translate)}}'
        });
      });
    }

  }
})();
