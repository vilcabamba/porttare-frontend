(function(){
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('SiteController', SiteController);

  function SiteController($rootScope, $ionicLoading, $auth, ProfileService) {// jshint ignore:line
    var siteVm = this,
        currentUser = null;

    siteVm.userName = null;
    siteVm.userImageURL = null;

    init();

    function init() {
      currentUser = $auth.user;
    }

    $rootScope.$on('$stateChangeStart', function(){
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
    });

    $rootScope.$on('$stateChangeSuccess', function () {
      $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeError', function(){
      $ionicLoading.hide();
    });

    $rootScope.$on('auth:login-success', function(){
      updateProperties();
    });

    $rootScope.$on('auth:validation-success', function(){
      updateProperties();
    });

    function userName () {
      if (currentUser) {
        var attributes = [
          'name',
          'nickname',
          'email'
        ];
        var presentAttribute = attributes.find(function(attribute) {
          return !angular.element.isEmptyObject(
            angular.element.trim(currentUser[attribute])
          );
        });
        return currentUser[presentAttribute];
      }
    }

    function getUserImageURL(){
      return ProfileService.getUserImageURL(currentUser);
    }

    $rootScope.$on('currentUserUpdated',function(event, updatedCurrentUser){
      currentUser = updatedCurrentUser;
      updateProperties();
    });

    function updateProperties(){
      siteVm.userName = userName();
      siteVm.userImageURL = getUserImageURL();
    }
  }
})();
