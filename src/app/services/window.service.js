(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('windowService', windowService);

    windowService.$inject = ['$window'];

    function windowService($window) {

        var api = {};

        // fromURL()
        // Retrieves the attribue from the url.
        // Parameters:
        //  name    Name of attribue to extract.
        //  url     The url - if not specified, location.href.
        // Returns the value of the attribue or null if not found.
        api.updateHref = function (uri, type) {
            $window.location.href = uri.concat('?type', type);

        };

        api.subscribeToUnload = function (fnCallback) {
            if (fnCallback) {
                $window.onbeforeunload = fnCallback;
            }
        }

        return api;
    }
})();