(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CategoryController', CategoryController);

  function CategoryController(data, $state) {
    var categoryVm = this;

    categoryVm.category = data.provider_category;//jshint ignore:line
    categoryVm.providers = data.provider_category.provider_profiles;//jshint ignore:line

    var centerMode = categoryVm.providers.length === 1;
    categoryVm.options = {
      model: {
        data: {
          category: categoryVm.category,
          providers: categoryVm.providers
        },
        actions: {
          onCardClick: function(data) {
            var itemsRoute = 'app.categories.provider';
            $state.go(itemsRoute, {
              categoryId: data.category.id,
              providerId: data.provider.id
            });
          }
        }
      },
      slickSettings: {
        centerMode: centerMode,
        mobileFirst: true,
        variableWidth: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 320,
            settings: {
              slidesToShow: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 4
            }
          }
        ]
      }
    };
  }
})();
