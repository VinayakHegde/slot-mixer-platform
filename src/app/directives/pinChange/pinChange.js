(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('pinChange', pinChange);

    function pinChange() {
        var directive = {
            bindToController: {},
            template: require('./pinChange.html'),
            transclude: false,
            restrict: 'E',
            controllerAs: '$ctrl',
            link: directiveLink,
            controller: directiveController
        };

        return directive;

        function directiveLink($scope, element, attrs, ctrls) {

        }
    }

    directiveController.$inject = ['webSocketService', 'navigationService', 'messageViewService'];

    function directiveController(webSocketService, navigationService, messageViewService) {
        this.$onInit = function () {
        }

        this.$postLink = function () {
        }

        this.$onChanges = function (changes) {
        }

        this.updateMaskedPin = function (maskedPin) {
            if (this.showPinVerify) {
                this.maskedPinVerify = maskedPin;
            } else if (this.showPinNew) {
                this.maskedPinNew = maskedPin;
            } else {
                this.maskedPin = maskedPin;
            }
        }

        this.confirmChange = function (pin) {
            if (!this.showPinVerify && !this.showPinNew) {
                this.pin = pin;

                this.showPinNew = true;
                messageViewService.set(messageViewService.for.ENTER_NEW_PINCODE);

                return;
            }

            if (!this.showPinVerify && this.showPinNew) {
                this.pinNew = pin;

                this.showPinVerify = true;
                messageViewService.set(messageViewService.for.CONFIRM_NEW_PINCODE);

                return;
            }

            if (this.showPinVerify && this.showPinNew) {
                this.pinVerify = pin;

                if (this.pinVerify == this.pinNew) {
                    webSocketService.changePin(this.pin, this.pinVerify);
                    navigationService.navigateBack();
                } else {
                    messageViewService.set(messageViewService.for.PINCODE_DO_NOT_MATCH);

                }
                return;
            }
        }
    }

})();