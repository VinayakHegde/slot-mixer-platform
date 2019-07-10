(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('webSocketService', webSocketService);
    webSocketService.$inject = ['gamoraInterface'
        , 'windowService'
    ];
    function webSocketService(gamoraInterface
        , windowService
    ) {

        var api = {},
            callbacks = {},
            services = {};

        // initialise()
        // Initialises the gamora WSI.
        api.initialise = function (options) {
            angular.extend(callbacks, options.callbacks || {});
            angular.extend(services, options.services || {});
            // Setup the Gamora Web Socket Interface.
            
            gamoraInterface.openSocket({
                // When the websocket has opened, automatiaclly get the device status.
                fnOnOpen: sendRequestWrapper(gamoraInterface.requestTypes.getStatus),
                fnOnClose: undefined,
                fnOnMessage: onMessage,
                fnOnError: undefined,
                fnOnRequest: undefined,
                fnOnResponse: undefined
            });

            windowService.subscribeToUnload(gamoraInterface.closeSocket);
        };

        // getConfiguration()
        // Requests general configuration details.
        api.getConfiguration = sendRequestWrapper(gamoraInterface.requestTypes.getConfiguration);

        // callForAssistance()
        // Send the call for assistance message.
        api.callForAssistance = sendCustomerWrapper(gamoraInterface.customerTriggerTypes.slotService);

        // setCustomerLanguage()
        // Lets the server know that we have changed the language for the Customer.
        api.setCustomerLanguage = gamoraInterface.sendSetLanguageRequest;

        // fundsToMachine()
        // Send the funds to machine cashless transaction.
        // Parameters:
        //  amount:         The amount to transfer.
        //  externalWallet: Optional - ???
        //  password:       Optional - Customers Pin.
        api.fundsToMachine = gamoraInterface.sendFundsToMachine;

        // pointsToMachine()
        // Send the points to machine cashless transaction.
        // Parameters:
        //  creditType:     The credit type. Either 'cash' or 'promo'.
        //  amount:         The amount to transfer.
        //  password:       Optional - Customers Pin.
        api.pointsToMachine = gamoraInterface.sendPointPlay;

        // Following two methods To be confirm with Colin
        api.pointsToMachineCashable = sendPointsWrapper(gamoraInterface.pointPlayCreditTypes.cashable);
        api.pointsToMachinePromo = sendPointsWrapper(gamoraInterface.pointPlayCreditTypes.promo);

        // changePin()
        // Send the change pin request.
        api.changePin = gamoraInterface.sendChangePinRequest;

        // ejectCard()
        // Send the eject card request.
        api.ejectCard = sendCustomerWrapper(gamoraInterface.customerTriggerTypes.ejectCard);

        // onMessage()
        // Called when a message is received from the Gamora WSI.
        // Parameters:
        //  message: An object containing details of the message received.
        function onMessage(message) {

            // Check what message we have received.
            switch (message.funct) {

                case "StatusResponse":

                    // Device status information returned.
                    //  message: a message object containing the message details.
                    if (message.attributes.showEject !== undefined && services.configService) {
                        services.configService.set("show-eject", message.attributes.showEject);
                    }
                    break;

                case "ConfigurationResponse":

                    // Configuration information returned.
                    _processConfigurationResponse(message);
                    break;

                case "Customer":
                    // Customer card has been inserted.
                    // Set the customer details.
                    if (services.customerService) {
                        services.customerService.set(message);
                        if (callbacks.fnOnCustomer) callbacks.fnOnCustomer();
                    }
                    break;
                case "Update":
                    if (message.type === "User") {
                        // Processes the Gamora Update Customer event.
                        // Check what the message type is.
                        if (services.customerService) {
                            services.customerService.update(message);
                            if (callbacks.fnOnCustomer) callbacks.fnOnCustomer();
                        }
                    }
                    break;
                case "Employee":
                    // If an employee card has been inserted, change to the slot tech web site (we need to add the EmployeeSession type).
                    windowService.updateHref(message.typeAttributes.uri, 'EmployeeSession');
                    break;

                case "ChangeDisplayMode":

                    // If changing to Attract Mode, do not reload web site.
                    if (message.attributes.type === "Attract") {

                        // Tell the system to switch to attract mode.
                        $rootScope.$broadcast('switchToAttract');
                    } else {
                        // Only proceed if we have a valid URI.
                        if (message.typeAttributes.uri !== '') {
                            //window.location.href = message.typeAttributes.uri + '?type=' + encodeURIComponent(message.attributes.type);
                            windowService.updateHref(message.typeAttributes.uri, encodeURIComponent(message.attributes.type));

                        }
                    }
                    break;

                case "DeviceStatusChanged":
                    // TODO (CP): Commented out for now - will be implemented later.
                    // Show relevant maintenance icons.
                    //_processStatusChanged(message.attributes);
                    break;

                case "ReloadWebsite":

                    // Tell the system we need to reload the website (when appropriate).
                    $rootScope.$broadcast('reloadWebsite');
                    break;

                case "ShowMessage":
                    // Show the message.
                    //  message: a message object containing the message details:
                    //      message.attributes.messageId:   the Id of the message.
                    //      message.attributes.len:         the length to display the message - zero equates to forever.
                    if (callbacks.fnShowMessage) {
                        // Extract message details.
                        callbacks.fnShowMessage(message.attributes.messageId);

                    } else {
                        // use message service and user show method
                        //showMessage("", localisationService.get(messageId), "", "", (length > 0), timeOut, messageId);

                    }
                    break;

                case "JackpotHit":
                    // Set the jackpot details.
                    //  message: a message object containing the message details:
                    //      message.attributes.jackpotId:       the Id of the jackpot.
                    //      message.attributes.jackpotName:     the jackpot name.
                    //      message.attributes.jackpotAmount:   the jackpot amount.
                    jackpotService.set(message);
                    break;

                case "HotSeatHit":
                    // Set the hot seat details.
                    //  message: a message object containing the message details:
                    //      message.attributes.promotionId:     the Id of the promotion.
                    //      message.attributes.hotSeatName:     the hot seat name.
                    //      message.attributes.freePlay:        the free play amount (money).
                    //      message.attributes.points:          the points amount (integer).
                    //      message.attributes.prize:           the prize description.
                    hotSeatService.set(message);
                    break;
            }
        }

        // _processConfigurationResponse()
        // Process the Gamora Configuration Response event.
        // Params:
        //  message: a message object containing the message details.
        function _processConfigurationResponse(message) {

            var updatePointTotals = false;

            // Get the Point Play Redemption Cash Value (multiplier) and store it in the config service.
            if (message.attributes.pointPlayRedemptionCashValue !== undefined && services.configService) {
                services.configService.set("point-play-redemption-cash-multiplier", message.attributes.pointPlayRedemptionCashValue);
                updatePointTotals = true;
            }

            // Get the Point Play Redemption Promo Value (multiplier) and store it in the config service.
            if (message.attributes.pointPlayRedemptionPromoValue !== undefined && services.configService) {
                services.configService.set("point-play-redemption-promo-multiplier", message.attributes.pointPlayRedemptionPromoValue);
                updatePointTotals = true;
            }

            // If the multipliers have changed, we neeed to update the totals on the customer currently loaded (if any).
            if (updatePointTotals) {
                if (services.customerService) {
                    services.customerService.updatePointTotals();
                }
            }

            // Store whether cashless transfers are turned on.
            if (message.attributes.cashlessTransfers !== undefined && services.configService) {
                services.configService.set("cashless-transfers-available", message.attributes.cashlessTransfers);
            }
        }

        function sendCustomerWrapper(triggerType) {
            return function () {
                gamoraInterface.sendCustomerTrigger(triggerType);
            };
        }

        function sendRequestWrapper(triggerType) {
            return function () {
                gamoraInterface.sendRequest(triggerType);
            };
        }

        function sendPointsWrapper(creditType) {
            return function (amount, password) {
                gamoraInterface.sendPointPlay(creditType, amount, password);
            };
        }

        return api;
        
    }
})();