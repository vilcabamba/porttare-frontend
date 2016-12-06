(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('DispatchersService', DispatchersService);

  function DispatchersService(CommonService, $q) {

    var service = {
      getDispatchers: getDispatchers,
      getDispatcher: getDispatcher,
      createDispatcher: createDispatcher,
      updateDispatcher:  updateDispatcher,
      deleteDispatcher:deleteDispatcher
    };

    return service;

    function getDispatchers() {
      return CommonService.getObjects('/api/provider/dispatchers');
    }

    function getDispatcher(id) {
      return CommonService.getObject(id, '/api/provider/dispatchers/');
    }

    function createDispatcher(data) {
      return CommonService.newObject(data, '/api/provider/dispatchers');
    }

    function updateDispatcher(data) {
      return CommonService.editObject(data, '/api/provider/dispatchers/');
    }

    function deleteDispatcher(id) {
      return CommonService.deleteObject(id, '/api/provider/dispatchers/');
    }
  }
})();
