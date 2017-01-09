(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('sidebarHeaderCurrentUser', sidebarHeaderCurrentUser);

  function sidebarHeaderCurrentUser(){
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/sidebar-header-current-user/sidebar-header-current-user.html'
    };
    return directive;
  }
})();
