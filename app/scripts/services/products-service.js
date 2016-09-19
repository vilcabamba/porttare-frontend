'use strict';

angular
  .module('porttare.services')
  .factory('ProductsService', ProductsService);

function ProductsService($http, ENV, $ionicPopup, $q) {
  var service = {
    getProducts: getProducts,
    getProduct: getProduct
  };

  return service;

  function getProducts(params) {
    return $http({
      method: 'GET',
      url: ENV.apiHost + '/api/products',
      params: params
    }).then(function(results){
      return results.data;
    }, function(){
      $ionicPopup.alert({
        title: 'Error',
        template: 'Hubo un error, intentalo nuevamente.'
      });
    });
  }
  function getProduct() {
    var product = {
      id: 1,
      name: 'provider1',
      description: 'restaurant',
      images:[ '../images/bg.png',
        '../images/bg.png',
        '../images/bg.png',
        '../images/bg.png',
        '../images/bg.png'
      ],
      more: 'more information',
      amount: 0,
      unitPrice: 2.5,
      totalPrice: 0
    };
    return $q(function(resolve) {
      resolve(product);
    });
  }
}
