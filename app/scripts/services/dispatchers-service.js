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

    function getDispatcher() {
      var defered = $q.defer();
      defered.resolve({id:1,
                      email:'lisseth.lopez@unl.edu.ec',
                      provider_office_id: 3, //jshint ignore:line
                      sucursal:'10 de agosto'});
      return defered.promise;
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
