(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('locationService', locationService);

    locationService.$inject = ['$location'];

    function locationService($location) {

        var api = {};

        // getFromURL()
        // Retrieves the attribue from the url.
        // Parameters:
        //  name    Name of attribue to extract.
        // Returns the value of the attribue or null if not found.
        api.getFromURL = function(name) {
			var value = $location.search() ? $location.search()[name] : null;

            if (value) {
                return value;
            }

            return null;
        };

        // Get the object for the Gamora Web socket.
        // Returns:
        //  Null if fails (message displayed on console).
        //  Otherwise and object containing:
        //      url:        The url to the Web Socket Server.
        //      protocol:    The protocol to pass to the Web Socket Server.
        api.getWebSocketOptions = function () {
            // Gamora always uses the UI Web Socket so set the variables accordingly.
            var protocol = ($location.protocol() == "https") ? "wss://" : "ws://",
                // Check if we have specified an ip in the URL - for use when running from PC.
                docURL = api.getFromURL("ip") || $location.host(),
                port = 7682;

            // Return an object containing the Web Socket URL and Protocol to use.
            return {
                // This will be hosted on the Service Fabric Server so we need to use localhost for the Web Socket URL (unless an IP is specified).
                url: protocol.concat(docURL, ":", port, "/ui"),
                protocol: "wsplugin-ui"
            };
        };

        return api;
    }
})();
