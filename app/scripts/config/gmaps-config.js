(function () {
  'use strict';

  angular.module('porttare')
  .config(function(uiGmapGoogleMapApiProvider, ENV){
      uiGmapGoogleMapApiProvider.configure({
        key: ENV.gMapsKey,
        v: '3',
        libraries: 'weather,geometry,visualization,places'
      });
    }
  );
})();
