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
      window.StatusBar && window.StatusBar.styleBlackTranslucent();
    }

    function normalStatusBar() {
      // return to default status bar style for the rest of the app
      window.StatusBar && window.StatusBar.styleDefault();
    }

    function startApp() {
      normalStatusBar();
      $localStorage.set('hasViewedTutorial','true');
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
