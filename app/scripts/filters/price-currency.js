(function () {
  'use strict';

  angular
    .module('porttare.filters')
    .filter('priceCurrency', priceCurrency);

  function priceCurrency(APP){
    return function (priceInCents) {
      return priceInCents / APP.centsInDollar;
    };
  }
})();
