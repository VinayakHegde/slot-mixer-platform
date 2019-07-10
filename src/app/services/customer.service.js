(function () {
    'use strict';

    // customerService
    angular
        .module('serviceWindow')
        .factory('customerService', customerService);

    customerService.$inject = ['$rootScope', 'configService']
    // This service handles customer related functionality.
    function customerService($rootScope, configService) {

        var api = {}, customer = {};

        // set()
        // Sets the current customer details.
        // Parameters:
        //  customerMessage:    the message received from Gamora containing the customers details.
        api.set = function (customerMessage) {

            // Get the number of decimal places to use.
            var decimalPlaces = parseInt(configService.get("decimal-places", "2"));

            customer = {};
            customer.id = customerMessage.attributes.id;
            customer.language = customerMessage.attributes.language;
            customer.membership = customerMessage.attributes.membership;
            customer.name = customerMessage.attributes.name;
            customer.sessionId = customerMessage.attributes.sessionId;
            customer.pinNotSet = customerMessage.attributes.pinNotSet;
            customer.message = customerMessage.typeAttributes.message;
            customer.promotionName = customerMessage.typeAttributes.promotionName;

            customer.sessionPoints = customerMessage.attributes.sessionPoints;
            customer.totalPoints = customerMessage.attributes.totalPoints;
            customer.earnedPoints = customerMessage.attributes.earnedPoints;

            _calculateTotalPoints();

            customer.cashless = {};
            if (customerMessage.children.Cashless !== undefined) {
                customer.cashless.cashable = Number(customerMessage.children.Cashless.cashable).toFixed(decimalPlaces);
                customer.cashless.nonCashable = Number(customerMessage.children.Cashless.nonCashable).toFixed(decimalPlaces);
                customer.cashless.availableCashableBalance = Number(customerMessage.children.Cashless.availableCashableBalance).toFixed(decimalPlaces);
            } else {
                customer.cashless.cashable = "";
                customer.cashless.nonCashable = "";
                customer.cashless.availableCashableBalance = "";
            }

			// next point calculation - used only for simulation
			customer.nextPointTarget = customerMessage.attributes.nextPointTarget;
			customer.nextPointEarned = customerMessage.attributes.nextPointEarned;


            // Tell the system that customer details have been set.
            $rootScope.$broadcast('gotCustomerDetails');
        };

        // updatePointTotals()
        // Update the customers total cash and promo points.
        // Called when the cash/promo multipliers have been updated.
        api.updatePointTotals = function () {

            // Ensure we actually have a customer currently stored.
            if (customer == null || $.isEmptyObject(customer)) {
                return;
            }

            _calculateTotalPoints();

            // Tell the system that customer details have been updated.
            $rootScope.$broadcast('updatedCustomerDetails');
        };

        // update()
        // Update the current customer details.
        // Parameters:
        //  customerDetails:    the message received from Gamora containing the updated customer details.
        api.update = function (customerMessage) {

            // Ensure we actually have a customer currently stored.
            if (customer == null || $.isEmptyObject(customer)) {
                return;
            }

            // Get the number of decimal places to use.
            var decimalPlaces = parseInt(configService.get("decimal-places", "2"));

            // Update the customer properties.
            customer.sessionPoints = customerMessage.attributes.sessionPoints;
            customer.totalPoints = customerMessage.attributes.totalPoints;

            _calculateTotalPoints();

            customer.cashless.cashable = Number(customerMessage.attributes.cashable).toFixed(decimalPlaces);
            customer.cashless.nonCashable = Number(customerMessage.attributes.nonCashable).toFixed(decimalPlaces);
            customer.cashless.availableCashableBalance = Number(customerMessage.attributes.availableCashable).toFixed(decimalPlaces);

            if (customerMessage.typeAttributes.promotionName != undefined) {
                customer.promotionName = customerMessage.typeAttributes.promotionName;
            }

            // Tell the system that customer details have been updated.
            $rootScope.$broadcast('updatedCustomerDetails');
        };

        // get()
        // Returns the current customer details.
        api.get = function () {
            return customer;
        };

        // getNumber()
        // Returns the current customer number. If not set, returns -1.
        api.getNumber = function () {
            return ('number' in customer ? customer.number : -1);
        };

        // clear()
        // Clears any existing customer details.
        api.clear = function () {
            customer = {};
        };

        return api;

        // _calculateTotalPoints()
        // Calculates the total cash and promo points value.
        function _calculateTotalPoints() {

            // Get the number of decimal places to use.
            var decimalPlaces = parseInt(configService.get("decimal-places", "2"));

            // Get the Point Play Redemption Cash Multiplier.
            var cashMultiplier = Number(configService.get("point-play-redemption-cash-multiplier", 1)).toFixed(decimalPlaces);

            // Get the Point Play Redemption Promo Multiplier.
            var promoMultiplier = Number(configService.get("point-play-redemption-promo-multiplier", 1)).toFixed(decimalPlaces);

            // Calculate total cash points - if the result is less than zero, set to zero.
            customer.totalCashPoints = Number((customer.totalPoints - customer.sessionPoints) * cashMultiplier).toFixed(decimalPlaces);
            if (customer.totalCashPoints < 0) {
                customer.totalCashPoints = Number("0").toFixed(decimalPlaces);
            }

            // Calculate total promo points - if the result is less than zero, set to zero.
            customer.totalPromoPoints = Number((customer.totalPoints - customer.sessionPoints) * promoMultiplier).toFixed(decimalPlaces);
            if (customer.totalPromoPoints < 0) {
                customer.totalPromoPoints = Number("0").toFixed(decimalPlaces);
            }
        }
    }

}());
