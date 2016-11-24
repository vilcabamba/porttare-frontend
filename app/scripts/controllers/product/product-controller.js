(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProductController', ProductController);

  function ProductController(data, CartService, $ionicPopup) {
    var productVm = this;
    productVm.more = false;
    productVm.toggleShow = toggleShow;
    productVm.product = data;
    productVm.addToCart = addToCart;
    productVm.count = 0;

    productVm.options = {
      priceCents: data.precio_cents, // jshint ignore:line
      onChangeValue: function(data) {
        productVm.count = data.itemsCount;
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
      CartService.addItem(productVm.product.id, productVm.count).then(function(response){
        console.log(response);
      }, function(){
        $ionicPopup.alert({
          title: 'Error',
          template: '{{::("globals.pleaseTryAgain"|translate)}}'
        });
      });
    }

  }
})();
