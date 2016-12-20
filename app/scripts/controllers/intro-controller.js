(function(){
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('IntroController', IntroController);

  function IntroController($state,
                           $localStorage,
                           $ionicPlatform,
                           $ionicSlideBoxDelegate) {
    var introVm = this;
    introVm.startApp = startApp;
    introVm.next = next;
    introVm.previous = previous;
    introVm.slideChanged = slideChanged;

    $ionicPlatform.ready(traslucentStatusBar);

    function traslucentStatusBar() {
      // this view is dark. make status bar visible
      if (window.StatusBar) {
        window.StatusBar.styleBlackTranslucent();
      }
    }

    function normalStatusBar() {
      // return to default status bar style for the rest of the app
      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
    }

    function startApp() {
      normalStatusBar();
      $localStorage.setItem('hasViewedTutorial','true');
      $state.go('prelogin');
    }

    function next() {
      $ionicSlideBoxDelegate.next();
    }

    function previous() {
      $ionicSlideBoxDelegate.previous();
    }

    function slideChanged(index) {
      introVm.slideIndex = index;
    }
  }
})();
