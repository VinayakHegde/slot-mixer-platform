(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('gamoraInterface', gamoraInterface);

    gamoraInterface.$inject = ['locationService'
        , 'gamoraWebSocket'
        , 'responseService'
        , 'timeService'
    ];

    function gamoraInterface(locationService
        , gamoraWebSocket
        , responseService
        , timeService
    ) {

        var api = {},
            fnClientOnMessage = null,
            fnClientOnRequest = null,
            fnClientOnResponse = null;

        // A list of request types.
        api.requestTypes = {
            getStatus: 'StatusRequest',
            getGames: 'GamesRequest',
            getMeters: 'MeterRequest',
            getSecureEnhancedConfiguration: 'SecureEnhancedConfigurationRequest',
            getMachineTimeRequest: 'GetMachineTimeRequest',
            getConfiguration: 'ConfigurationRequest'
        };

        // A list of funds transfer transaction types.
        api.fundsTransferTransactionTypes = {
            toMachine: 'FundsTransferToMachine',
            fromMachine: 'FundsTransferFromMachine'
        };

        // A list of point play credit types.
        api.pointPlayCreditTypes = {
            cashable: 'Cashable',
            promo: 'Promo'
        };

        // A list of employee trigger types.
        api.employeeTriggerTypes = {
            reboot: "Reboot",
            ejectCard: "EjectCard",
            recalibrate: "Recalibrate",
            enableEGM: "EnableEGM",
            disableEGM: "DisableEGM",
            enableBillAcceptor: "EnableBillAcceptor",
            disableBillAcceptor: "DisableBillAcceptor",
            enableSound: "EnableSound",
            disableSound: "DisableSound",
            flipDisplay: "FlipDisplay",
            setTime: "SetTime",
            ramClear: "RAMClear",
            uploadLogs: "UploadLogs",
            resetSEConfig: "ResetSEConfig",
            uploadFirmware: "UpdateFirmware"
        };

        // A list of customer trigger types.
        api.customerTriggerTypes = {
            slotService: "SlotService",
            drinkService: "DrinkService",
            ejectCard: "EjectCard",
            forceEjectCard: "ForceEjectCard"
        }

        api.openSocket = function (options) {
            // Get the Gamora Web Socket URL
            var wsOptions = locationService.getWebSocketOptions();

            if (!wsOptions.url && !wsOptions.protocol) {
                if (locationService.getFromURL("debug")) {
                    console.log("[Gamora WebSocket Interface] - No options for Connecting to web socket", wsOptions);
                }

                return;
            }

            // If in debug mode, log the message to the console.
            if (locationService.getFromURL("debug")) {
                console.log("[Gamora WebSocket Interface] - Connecting to web socket with following options: ", JSON.stringify(wsOptions));
            }

            // Store variables locally.
            fnClientOnMessage = options.fnOnMessage;
            fnClientOnRequest = options.fnOnRequest;
            fnClientOnResponse = options.fnOnResponse;

            gamoraWebSocket.open({
                wsOptions: wsOptions,
                fnOnMessage: fnOnMessage,
                fnOnError: options.fnOnError,
                fnOnOpen: options.fnOnOpen,
                fnOnClose: options.fnOnClose,
                keepAlive: null,
                keepAlivePeriod: null
            });
        }

        // Close the Gamora Web Socket.
        api.closeSocket = function () {
            gamoraWebSocket.close();
        };


        // sendEmployeeTrigger()
        // Sends the specified Employee Trigger Type to the Gamora WSI.
        // Parameters:
        //  triggerType:    Set to a value from the igsGamoraWSI.employeeTriggerTypes variable.
        api.sendEmployeeTrigger = function (triggerType) {

            // Build the attributes to send with the message.
            var attributes = [];
            attributes.push({ name: "gam:type", value: triggerType });

            // Send the Trigger message.
            send("Trigger", "EmployeeTrigger", attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest(triggerType);
            }
        }

        // sendCustomerTrigger()
        // Sends the specified Customer Trigger Type to the Gamora WSI.
        // Parameters:
        //  triggerType:    Set to a value from the igsGamoraWSI.customerTriggerTypes variable.
        api.sendCustomerTrigger = function (triggerType) {

            // Build the attributes to send with the message.
            var attributes = [];
            attributes.push({ name: "gam:type", value: triggerType });

            // Send the Trigger message.
            send("Trigger", "CustomerTrigger", attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest(triggerType);
            }
        }

        // sendRequest()
        // Sends the specified Request Type to the Gamora WSI.
        // Parameters:
        //  requestType:    Set to a value from the igsGamoraWSI.requestTypes list.
        api.sendRequest = function (requestType, attributes) {

            send("Information", requestType, attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest(requestType);
            }
        }

        // sendSetAssetNumberRequest()
        // Sends a Set Asset Number request to the Gamora WSI.
        // Parameters:
        //  assetNumber: The asset number to be set to.
        api.sendSetAssetNumberRequest = function (assetNumber) {

            // Build the attributes to send with the message.
            var attributes = [];
            attributes.push({ name: "gam:assetNumber", value: assetNumber });

            // Send the Trigger message.
            send("Trigger", "SetAssetNumber", attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest("SetAssetNumber");
            }
        }

        // sendSetLanguageRequest()
        // Sends a Set Language request to the Gamora WSI.
        // Parameters:
        //  language: The language being set (in en-GB format).
        api.sendSetLanguageRequest = function (language) {

            // Build the attributes to send with the message.
            var attributes = [];
            attributes.push({ name: "gam:language", value: language });

            // Send the Trigger message.
            send("Trigger", "SetLanguage", attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest("SetLanguage");
            }
        }

        // fund transfer to machine request
        api.sendFundsToMachine = function (amount, externalWallet, password) {
            sendFundsTransfer(api.fundsTransferTransactionTypes.toMachine, amount, externalWallet, password);
        }

        // fund transfer from machine request
        api.sendFundsFromMachine = function (amount, externalWallet, password) {
            sendFundsTransfer(api.fundsTransferTransactionTypes.fromMachine, amount, externalWallet, password);
        }

        // sendPointPlay()
        // Send a Point Play transaction request.
        // Parameters:
        //  creditType:         The point play credit type.
        //  amount:             The amount to process.
        //  password:           Optional - The Customers pin number.
        api.sendPointPlay = function (creditType, amount, password) {

            // Build the attributes to send with the message.
            var attributes = [];
            attributes.push({ name: "gam:creditType", value: (creditType === "cash") || (creditType === api.pointPlayCreditTypes.cashable) ? api.pointPlayCreditTypes.cashable : api.pointPlayCreditTypes.promo });
            attributes.push({ name: "gam:amount", value: amount });

            // Check if password has been specified.
            if (password != null) {
                attributes.push({ name: "gam:password", value: password });
            }

            // Send the Trigger message.
            send("Trigger", "PointPlay", attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest("PointPlay");
            }
        };

        // sendChangePinRequest()
        api.sendChangePinRequest = function (currentPin, newPin) {

            // Build the attributes to send with the message.
            var attributes = [];
            attributes.push({ name: "gam:oldPassword", value: currentPin });
            attributes.push({ name: "gam:newPassword", value: newPin });

            // Send the Trigger message.
            send("Trigger", "ChangePin", attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest("ChangePin");
            }
        }

        // sendFundsTransfer()
        // Send a Funds Transfer transaction request.
        // Parameters:
        //  transactionType:    The funds transfer transaction type.
        //  amount:             The amount to process.
        //  exteralWallet:      Optional - ???.
        //  password:           Optional - The Customers pin number.
        function sendFundsTransfer(transactionType, amount, externalWallet, password) {

            // Build the attributes to send with the message.
            var attributes = [];
            attributes.push({ name: "gam:transactionType", value: transactionType });
            attributes.push({ name: "gam:amount", value: amount });

            // Check if external wallet has been specified.
            if (externalWallet != null) {
                attributes.push({ name: "gam:externalWallet", value: externalWallet });
            }

            // Check if password has been specified.
            if (password != null) {
                attributes.push({ name: "gam:password", value: password });
            }

            // Send the Trigger message.
            send("Trigger", "FundsTransfer", attributes);

            // Inform the client a request has been done.
            if (fnClientOnRequest) {
                fnClientOnRequest("FundsTransfer");
            }
        };

        // Send a message to the Gamora UI Web Socket server.
        // Parameters:
        //  messageType:        The message type to send.
        //  messageBodyType:    the message body type to send.
        //  attributes:     Null if no attributes otherwise an array of objects with the following properties:
        //                  {
        //                      name:   Name of attribute.
        //                      value:  value of attribute.
        //                  }
        function send(messageType, messageBodyType, attributes) {
            // Convert the attributes object into a string of attributes.
            var attributesString = '';
            if (attributes != null) {
                for (var index = 0; index < attributes.length; index++) {
                    attributesString += ' ' + attributes[index].name + '="' + attributes[index].value + '"';
                }
            }

            // Build the XML for the request.
            var message = '<?xml version="1.0" encoding="utf-8"?>';
            message += '<gam:Gamora xmlns:gam="http://IntelligentGaming/Gamora/v1.0" gam:source="NeonTouchUI" gam:timestamp="' + timeService.getTimestamp() + '">';
            message += '<gam:' + messageType + '>';
            message += '<gam:' + messageBodyType + attributesString + "/>";
            message += '</gam:' + messageType + '>';
            message += '</gam:Gamora>';

            // Send the message.
            gamoraWebSocket.send(message);
        };

        // Process a message from the Gamora Web Socket.
        function fnOnMessage(response) {
            // If no client onMessage function setup, no point in processing the message any further.
            if (!fnClientOnMessage) return;

            // Decode the message received from the Gamora Web Socket.
            var formattedResponse = responseService.decode(response.data);

            // If in debug mode, log the message to the console.
            if (locationService.getFromURL("debug")) {
                console.log("[Gamora WebSocket Interface] - Received: ", formattedResponse);
            }

            // Only trigger the Client On Message function if we actually have a formatted repsonse.
            if (formattedResponse != null) {
                fnClientOnMessage(formattedResponse);

                // Inform the client a request has been done.
                if (fnClientOnResponse) {
                    fnClientOnResponse(formattedResponse.funct);
                }
            }
        }

        return api;
    }
})();