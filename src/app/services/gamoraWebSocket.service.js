(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('gamoraWebSocket', gamoraWebSocket);

    gamoraWebSocket.$inject = ['locationService'
        , '$timeout'
        , '$interval'
    ];

    function gamoraWebSocket(locationService
        , $timeout
        , $interval
    ) {

        var api = {},
            _socket,
            keepAlive,
            cancelKeepAlive;

        // open the web socket.
        api.open = function (options) {
            cancelKeepAlive = function () {
                if (keepAlive) {

                    if (locationService.getFromURL("debug")) {
                        console.log("[Gamora WebSocket] - cancelling KeepAlive.");
                    }
                    $interval.cancel(keepAlive);
                }
            }
            try {
                if (typeof MozWebSocket != "undefined") {
                    _socket = new MozWebSocket(options.wsOptions.url, options.wsOptions.protocol);
                }
                else {
                    _socket = new WebSocket(options.wsOptions.url, options.wsOptions.protocol);
                }
            } catch (e) {
                // Log the error to the console.
                if(locationService.getFromURL("debug")){
                    console.log("[Gamora WebSocket] - Error:", e.message);
                }
                // Error occurred. If we have specified an onError function, use that otherwise log to console.
                if (options.fnOnError)  fnOnError(e.message); 

                return null;
            }

            // If a binary type has been specified, set it now.
            if (options.wsOptions.binaryType && _socket) {
                _socket.binaryType = options.wsOptions.binaryType;
            }

            // Always set the onOpen function to be local so we can create a keep alive request.
            _socket.onopen = function onOpen() {
                if(locationService.getFromURL("debug")){
                    console.log("[Gamora WebSocket] - Connected.");
                }

                if (!options.keepAlive) {
                    // Cancel the keep alive if required.
                    cancelKeepAlive();

                    // start interval
                    keepAlive = $interval(function () {
                        if (_socket && _socket.readyState == _socket.OPEN) {
                            // Debug mode on, log to console.
                            if (locationService.getFromURL("debug")) {
                                console.log("[Gamora WebSocket] - Sending Keep Alive");
                            }
                            _socket.send('');
                        }
                    }, options.keepAlivePeriod || 60000);
                }

                // If a client on open function was set, call it now.
                if (options.fnOnOpen) options.fnOnOpen();
            }

            // Always set the onClose function to be local to handle automatic reconnects.
            _socket.onclose = function onClose() {

                // Cancel the keep alive if required.
                cancelKeepAlive();

                // We need to automatically reconnect.
                if (locationService.getFromURL("debug")) {
                    console.log("[Gamora WebSocket] - Socket closed. Attempting reconnect in 5 seconds...");
                }
                $timeout(function () {
                    if (locationService.getFromURL("debug")) {
                        console.log("[Gamora WebSocket] - Attempting to reconnect...");
                    }
                    api.open(options);
                }, 5000);

                // If a client on close function was set, call it now.
                if (options.fnOnClose) options.fnOnClose();
            };

            // Check if an on message function has been declared.
            _socket.onmessage = function onMessage(event) {
                if (options.fnOnMessage) options.fnOnMessage(event);
            }

            // Check if an on error function has been declared.
            _socket.onerror = function onError(event) {
                // Ironically, the onerror function does not actually return an error code.
                console.error("[Gamora WebSocket] - Web socket has generated an error.", event);

                if (options.fnOnError) options.fnOnError();
            };

        }

        // Close the web socket.
        api.close = function () {

            // Ensure the Keep Alive request is cancelled.
            cancelKeepAlive();

            if (_socket && _socket.readyState != _socket.CLOSED) {
                _socket.close();
            }
        };

        // Send message to the web socket.
        api.send = function (message) {

            // If in debug mode, log the message to the console.
            if (locationService.getFromURL("debug")) {
                console.log("[Gamora WebSocket] - Sending: ", message );
            }

            // Ensure the socket is actually open
            if (_socket && _socket.readyState == _socket.OPEN) {
                _socket.send(message);
            } else if (locationService.getFromURL("debug")) {
                console.log("[Gamora WebSocket] - Could not send message, socket not open." );
            }
        };

        return api;
        
    }
})();