(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .provider('configService', configService);

    // Maintains a list of configuration key/ value pairs.
    function configService() {

        var providerApi = {},
            // Holds a list of configuration settings.
            defaults = {
                'default-language': 'en-GB',
                'default-delay': '3',
                'screen-attract': 'IGSPlaytechLogo',
                'screen-customer-start': 'IGSNotImplemented',
                'screen-default-anim-open': 'fadeIn',
                'screen-default-anim-close': 'fadeOut',
                'message-autoclose-delay': '3',
                'message-open-animation': 'bounceInDown',
                'message-close-animation': 'bounceOutDown',
                'show-eject': 'false',
                'decimal-places': '2',
                'hammer-threshold': '20',
                'hammer-time': '2000',
                'cashless-transfers-available': 'false'
            }, settings = {
                'service-window-class': 'large',
                'start-up-page': getBaseUrl().concat('/theme/index.html'),
                'path-to-template': getBaseUrl().concat('/theme/templates/'),
                'path-to-media': getBaseUrl().concat('/theme/media/'),
                'path-to-language': getBaseUrl().concat('/theme/languages/')
            };

        function getBaseUrl() {
            var baseUrl = document.getElementsByTagName('base')[0].href,
                lastIndex = baseUrl.length - 1;
            if (baseUrl[lastIndex] == '/') {
                baseUrl = baseUrl.substring(0, lastIndex);
            }

            return baseUrl;

        }

        // set() adds/updates a configuration value.
        //  key - key to store the value under.
        //  value - the value to store.
        function set(key, value) {
            settings[key] = value;
        };

        // get() returns the value stored against the passed in key.
        //  key             - the key to get the value of.
        //  defaultValue    - (optional) if the key  does not exist, return the default value.
        function get(key, defaultValue) {
            var setting = settings[key] || defaults[key];

            if (!setting && defaultValue !== undefined) {
                return defaultValue;
            } else {
                return setting;
            }
        };

        providerApi.$get = function () {
            return {
                set: set,
                get: get,
                getBaseUrl: getBaseUrl
            };
        }

        return providerApi;
    }

}());