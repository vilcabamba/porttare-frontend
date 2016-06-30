(function(){
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('IntroController', IntroController);

  function IntroController($state, $ionicSlideBoxDelegate, $window) {
    var introVm = this;
    introVm.startApp = startApp;
    introVm.next = next;
    introVm.previous = previous;
    introVm.slideChanged = slideChanged;

    function startApp() {
      $window.localStorage.setItem('hasViewedTutorial','true');
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
