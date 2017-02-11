(function () {
  'use strict';

  angular
    .module('porttare')
    .run(pushNotificationsConfig);

  function pushNotificationsConfig(){
    var notificationsHandler;

    document.addEventListener(
      'deviceready',
      registerPushNotifications,
      false
    );

    function registerPushNotifications(){
      notificationsHandler = PushNotification.init({
        "android": {
          "senderID": "1057338916791", // TODO use ENV
          "forceShow": true
        },
        "ios": {
          "sound": true,
          "vibration": true,
          "badge": true
        },
        "windows": {}
     });

     notificationsHandler.on('registration', function(data) {
         console.log("registration event: " + data.registrationId);
     });

     notificationsHandler.on('error', function(e) {
         console.log("push error = " + e.message);
     });

     notificationsHandler.on('notification', function(data) {
        console.log('notification event');
         console.log(data);
        return notificationsHandler.finish();
     });
    }
  }
})();
