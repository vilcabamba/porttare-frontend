(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderDetailController', ProviderDetailController);

  function ProviderDetailController(data) {
    var providerDetVm = this;
    providerDetVm.provider = data.data.provider_profile; //jshint ignore:line
    providerDetVm.fecha_ap=moment(providerDetVm.provider.provider_offices[0].hora_de_apertura,["h:mm A"]).format("HH:mm"); //jshint ignore:line
    providerDetVm.fecha_cie=moment(providerDetVm.provider.provider_offices[0].hora_de_cierre,["h:mm A"]).format("HH:mm"); //jshint ignore:line
    providerDetVm.imagenFondo=data.imagen;
  }
})();
