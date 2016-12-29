(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('PusherService', PusherService);

  function PusherService($q, $auth, ENV) {
    var serviceLoaded = false,
        loadDeferred,
        pusherClient,
        Authenticator;

    var service = {
      load: loadLibrary,
      listen: listenChannel
    };

    Authenticator = {
      outgoing: function (message, callback) {
        var currentUser = $auth.user;
        message['ext'] = {
          authorizations: {
            uid: currentUser.uid,
            auth_token: currentUser.auth_token, // jshint ignore:line
            client_id: currentUser.client_id // jshint ignore:line
          }
        };
        callback(message);
      }
    };

    return service;

    function listenChannel(channel, eventName, callback) {
      var channel = pusherClient.subscribe(channel);
      channel.bind(eventName, callback);
    }

    function loadLibrary() {
      if (serviceLoaded) {
        console.log('serviceLoaded!');
        return $q.resolve();
      } else {
        loadDeferred = $q.defer();
        appendPusherScript();
        return loadDeferred.promise;
      }
    }

    function appendPusherScript() {
      var pusherURI = 'https://js.pusher.com/3.2/pusher.min.js';
      var script = document.createElement('script');
      script.src = pusherURI;
      script.type = 'text/javascript';
      script.onload = pusherLoaded;
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    function pusherLoaded() {
      var currentUser = $auth.user;
      serviceLoaded = true;
      pusherClient = new Pusher(ENV.pusherKey, {
        encrypted: true,
        authEndpoint: ENV.apiHost + '/api/pusher_auth', // jshint ignore:line
        auth: {
          headers: {
            'Accept': 'application/json',
            'token-type': 'Bearer',
            'uid': currentUser.uid,
            'client': currentUser.client_id, // jshint ignore:line
            'access-token': currentUser.auth_token // jshint ignore:line
          }
        }
      });
      loadDeferred.resolve();
    }
  }
})();
