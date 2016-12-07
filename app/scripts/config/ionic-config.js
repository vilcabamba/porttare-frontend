(function () {
'use strict';

  angular
    .module('porttare')
    .config(ionicConfig);

  function ionicConfig($ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.backButton.icon(backButtonIcon());
    $ionicConfigProvider.backButton.text(false);

    document.addEventListener('deviceready', styleStatusBar, false);

    function backButtonIcon() {
      if (window.ionic.Platform.isIOS()) {
        return 'ion-ios-arrow-back';
      } else {
        return 'ion-android-arrow-back';
      }
    }

    function styleStatusBar() {
      if (!window.cordova) { return; }
      if (cordova.platformId === 'android') {
        window.StatusBar.backgroundColorByHexString('#FDC30D');
      } else {
        window.StatusBar.styleLightContent();
      }
    }
  }
})();
