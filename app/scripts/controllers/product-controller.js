(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProductController', ProductController);

  function ProductController(ProductsService) {
    var productVm = this;
    productVm.more = false;
    productVm.updatePrice = updatePrice;
    productVm.toggleShow = toggleShow;

    init();

    productVm.slickConfig = {
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false
    };

    function toggleShow() {
      productVm.more = !productVm.more;
    }

    function updatePrice (opt) {
      if(opt === 'add'){
        productVm.product.amount ++;
      }else if(opt === 'remove'){
        productVm.product.amount --;
      }
      productVm.product.totalPrice = (productVm.product.amount * productVm.product.unitPrice);
    }

    function init() {
      ProductsService.getProduct().then(function(results){
        productVm.product = results;
      });
    }
  }
})();
