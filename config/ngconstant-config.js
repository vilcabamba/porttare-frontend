(function() {
  'use strict';

  var ngconstantConfig = {
    options: {
      space: '  ',
      wrap: '"use strict";\n\n {%= __ngModule %}',
      name: 'porttare.config',
      dest: '<%= yeoman.app %>/<%= yeoman.scripts %>/configuration.js'
    },
    development: {
      constants: {
        ENV: {
          name: 'development',
          apiHost: 'http://localhost:5000'
        }
      }
    },
    staging: {
      constants: {
        ENV: {
          name: 'staging',
          apiHost: '//porttare-staging.herokuapp.com'
        }
      }
    },
    production: {
      constants: {
        ENV: {
          name: 'production',
          apiHost: 'http://api.yoursite.com'
        }
      }
    },
    test: {
      constants: {
        ENV: {
          name: 'test',
          apiHost: 'http://porttare-integration.herokuapp.com'
        }
      }
    }
  };

  return module.exports = ngconstantConfig;
})();
