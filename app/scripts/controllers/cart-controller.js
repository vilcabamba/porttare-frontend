(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('CartController', CartController);

  function CartController($auth,
                          $scope,
                          $state,
                          $translate,
                          $ionicPopup,
                          $ionicHistory,
                          $ionicLoading,
                          APP,
                          billingAddresses,
                          deliveryAddresses,
                          ModalService,
                          BillingAddressesService,
                          ProfileAddressesService,
                          CartService,
                          CustomerOrderDeliveryService) {
    var cartVm = this;
    cartVm.total = 0;
    cartVm.showCheckoutModal = showCheckoutModal;
    cartVm.closeModal = closeModal;
    cartVm.runCheckout = runCheckout;
    cartVm.paymentMethods = APP.paymentMethods;
    cartVm.assignBillingAddress = assignBillingAddress;
    cartVm.assignAddress = assignAddress;
    cartVm.messages = {};
    cartVm.clearDeliveryTime = clearDeliveryTime;
    cartVm.updateOrderItem = updateOrderItem;
    cartVm.removeOrderItem = removeOrderItem;
    cartVm.showCustomerOrderDelivery = showCustomerOrderDelivery;
    cartVm.submitCustomerOrderDelivery = submitCustomerOrderDelivery;
    cartVm.CustomerOrderDeliverySelect = CustomerOrderDeliverySelect;
    cartVm.customerOrderDeliveryNewAddress = customerOrderDeliveryNewAddress;
    cartVm.customerOrderDeliverySelectPickup = customerOrderDeliverySelectPickup;
    cartVm.checkoutForm = {
      forma_de_pago: 'efectivo' // only method supported ATM
    };
    cartVm.openEditModal = openEditModal;
    cartVm.slickSettings = {
      infinite: false,
      lazyLoad: 'progressive',
      responsive: [
        {
          breakpoint: 320,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 6
          }
        }
      ]
    };

    init();

    function init() {
      cartVm.cart = $auth.user.customer_order;
      cartVm.total = calculateTotal();
      cartVm.billingAddresses = billingAddresses;
      cartVm.addresses = deliveryAddresses;
      cartVm.slickFlag = true; // https://github.com/devmark/angular-slick-carousel#slide-data
      getDeliveryMethods();
    }

    function saveNewBillingAddress(){
      if ($scope.billingAddressesVm.form.$valid) {
        BillingAddressesService.createBillingAddress($scope.billingAddressesVm.billingAddress).then(function success(resp){
          cartVm.billingAddresses.push(resp.customer_billing_address); //jshint ignore:line
          closeModal().then(showCheckoutModal);
        }, function(error){
          $scope.billingAddressesVm.messages = error.data.errors;
        });
      }
    }

    function saveNewAddress(){
      if ($scope.pfaVm.addressForm.$valid) {
        ProfileAddressesService.createAddresses(
          $scope.pfaVm.addressFormData
        ).then(function(response){
          cartVm.addresses.push(response.customer_address); //jshint ignore:line
          closeModal();
          refreshCart(); // api will gracefully set addresses
        }, function(error){
          $scope.pfaVm.messages = error.errors;
        });
      }
    }

    function refreshCart() {
      CartService.getCart().then(function (response){
        cartVm.cart = response.customer_order; // jshint ignore:line
      });
    }

    function showCheckoutModal() {
      if (needsToAddDeliveryAddress()) {
        customerOrderDeliveryNewAddress();
      } else if (cartVm.billingAddresses.length === 0) {
        $scope.billingAddressesVm = {
          closeModal: closeModal,
          submitModal: saveNewBillingAddress
        };
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/billing-addresses/new-edit.html'
        });
      } else {
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/cart/checkout.html'
        });
      }
    }
    function closeModal() {
      clearData();
      return ModalService.closeModal();
    }

    function clearData() {
      cartVm.checkoutForm = {};
      cartVm.messages = {};
      cartVm.updateErrors = {};
      cartVm.currentItem = null;
      $scope.billingAddressesVm = {};
      $scope.pfaVm = {};
    }

    function runCheckout() {
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      CartService.checkout(cartVm.checkoutForm)
        .then(function success(response) {
          nextViewIsRoot();
          $state.go('app.customerorders.show', {
            id: response.customer_order.id,
            customerOrder: response.customer_order
          }).then(function () {
              $auth.user.customer_order = null;
              $ionicPopup.alert({
                title: 'Alerta',
                template: '{{::("cart.successfullyOrder"|translate)}}'
              }).then(closeModal);
              $scope.$emit('order-finished');
            });
        }, function error(res) {
          $ionicLoading.hide();
          if (res && res.errors) {
            cartVm.messages = res.errors;
          } else {
            var message = '{{::("globals.pleaseTryAgain"|translate)}}';
            $ionicPopup.alert({
              title: 'Error',
              template: message
            });
          }
        });
    }

    function assignBillingAddress(billingAddress) {
      cartVm.checkoutForm.customer_billing_address_id = billingAddress.id;
      selectItem(cartVm.billingAddresses, billingAddress);
    }

    function assignAddress(address) {
      cartVm.providerProfile.customer_order_delivery.delivery_method = 'shipping'; // jshint ignore:line
      cartVm.providerProfile.customer_order_delivery.customer_address_id = address.id;
      selectItem(cartVm.addresses, address);
    }

    function selectItem(items, item) {
      angular.forEach(items, function (elem) {
        elem.selected = false;
      });
      if (item) {
        item.selected = true;
      }
    }

    function calculateTotal() {
      var totalCents = 0,
        centValue = 0.01;

      if (cartVm.cart && cartVm.cart.provider_profiles) {
        angular.forEach(cartVm.cart.provider_profiles, function (provider) {
          totalCents = totalCents + getTotalValueItems(provider);
        });
      }
      return totalCents * centValue;
    }

    function getTotalValueItems(provider) {
      var total = 0;
      if(provider.customer_order_items) {
        angular.forEach(provider.customer_order_items, function (item) {
          total = total + (item.provider_item_precio_cents * item.cantidad);
        });
      }
      return total;
    }

    function clearDeliveryTime(){
      cartVm.providerProfile.customer_order_delivery.deliver_at = null;
    }

    function getDeliveryMethods(){
      var methodsKeys, translationMapping, translationKeys;
      methodsKeys = APP.deliveryMethods;
      translationMapping = methodsKeys.reduce(function (memo, method) {
        memo['cart.deliveryMethods.' + method] = method;
        return memo;
      }, {});
      translationKeys = Object.keys(translationMapping);
      $translate(translationKeys).then(function (translations) {
        var formattedMethods = translationKeys.map(function (translationKey) {
          return {
            value: translationMapping[translationKey],
            label: translations[translationKey]
          };
        });
        cartVm.formattedDeliveryMethods = formattedMethods;
      });
    }

    function openEditModal(item){
      cartVm.currentItem = angular.copy(item);
      cartVm.counterOptions = {
        limit: 1,
        cantidad: cartVm.currentItem.cantidad,
        priceCents: cartVm.currentItem.provider_item_precio_cents, // jshint ignore:line
        onChangeValue: function (data) {
          cartVm.currentItem.cantidad = data.itemsCount;
        }
      };
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/cart/order-item.html',
        backdropClickToClose: true,
        focusFirstInput: false
      });
    }

    function updateOrderItem(){
      cartVm.slickFlag = false;
      CartService.updateOrderItem(cartVm.currentItem).then(function(response){
        cartVm.cart = response.customer_order; //jshint ignore:line
        cartVm.total = calculateTotal();
        cartVm.slickFlag = true;
        closeModal();
      }, function(errorResponse){
        cartVm.updateErrors = errorResponse.errors;
      });
    }

    function removeOrderItem(item){
      cartVm.slickFlag = false;
      CartService.removeOrderItem(item).then(function success(resp){
        cartVm.cart=resp.data.customer_order;
        cartVm.total= calculateTotal();
        cartVm.slickFlag = true;
        closeModal();

        if( CartService.isCartEmpty(cartVm.cart) ){
          nextViewIsRoot();
          $state.go(APP.successState);
        }
      });
    }

    function CustomerOrderDeliverySelect(){
      angular.forEach(cartVm.addresses, function (elem) {
        if (elem.id==cartVm.providerProfile.customer_order_delivery.customer_address_id){ //jshint ignore:line
          selectItem(cartVm.addresses, elem);
          return;
        }
      });
    }

    function showCustomerOrderDelivery(providerProfile){
      cartVm.providerProfile = angular.copy(providerProfile);
      if (providerProfile.customer_order_delivery.deliver_at){ //jshint ignore:line
        cartVm.providerProfile.customer_order_delivery.deliver_at = new Date(providerProfile.customer_order_delivery.deliver_at); //jshint ignore:line
      }
      cartVm.CustomerOrderDeliverySelect();
      ModalService.showModal({
        parentScope: $scope,
        backdropClickToClose: true,
        fromTemplateUrl: 'templates/cart/customer-order-delivery-modal.html',
      });
    }

    function submitCustomerOrderDelivery() {
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });
      CustomerOrderDeliveryService.updateCustomerOrderDelivery(
        cartVm.providerProfile.customer_order_delivery //jshint ignore:line
      ).then(function success(resp){
        $ionicLoading.hide().then(function(){
          $auth.user.customer_order = resp.customer_order; //jshint ignore:line
          init();
          closeModal();
        });
      }, function error(res) {
        $ionicLoading.hide();
        if (res && res.data.errors ) {
          cartVm.messages = res.data.errors;
        } else {
          var message = '{{::("globals.pleaseTryAgain"|translate)}}';
          $ionicPopup.alert({
            title: 'Error',
            template: message
          });
        }
      });
    }

    function customerOrderDeliverySelectPickup(){
      selectItem(cartVm.addresses);
      cartVm.providerProfile.customer_order_delivery.customer_address_id = null;
      cartVm.providerProfile.customer_order_delivery.delivery_method = 'pickup';
    }

    function customerOrderDeliveryNewAddress(){
      closeModal().then(function(){
        $scope.pfaVm = {
          closeModal: closeModal,
          processAddress: saveNewAddress,
          defaultInCurrentGeolocation: true
        };
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/profile/addresses/modal-form.html'
        });
      });
    }

    function nextViewIsRoot(){
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
    }

    function anyDeliveryIsShipping(){
      return cartVm.cart.provider_profiles.some(function (providerProfile){
        return providerProfile.customer_order_delivery.delivery_method === 'shipping'; // jshint ignore:line
      });
    }

    function needsToAddDeliveryAddress(){
      return cartVm.addresses.length === 0 && anyDeliveryIsShipping();
    }
  }
})();
