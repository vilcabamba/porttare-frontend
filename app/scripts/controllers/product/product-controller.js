(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProductController', ProductController);

  function ProductController(data) {
    var productVm = this;
    productVm.more = false;
    productVm.toggleShow = toggleShow;
    productVm.product = data;

    productVm.options = {
      priceCents: data.precio_cents, // jshint ignore:line
      onChangeValue: function() {}
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

  }
})();
