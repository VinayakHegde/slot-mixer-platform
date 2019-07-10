/* Directive Name: call-for-assistance
 * When used with element, let the host know about help required and displays message on screen on tap/press/click.
 * 
 * Usage:
 * <button call-for-assistance self-hide-message>Need Help? </button>
 * 
 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('callForAssistance', callForAssistance);

    // callForAssistance
    // This directive controls the calling for assistance.
    callForAssistance.$inject = ['webSocketService', 'messageViewService', 'hammerService'];
    function callForAssistance(webSocketService, messageViewService, hammerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs, $ctrls) {
            hammerService.addTap($element, function () {
                // Simply call the call for assistance function.
                webSocketService.callForAssistance();

                if (angular.isDefined($attrs.showDefaultMessage)) {
                    messageViewService.set({
                        message: messageViewService.for.SERVICE_REQUESTED,
                        messageIcon: 'notification.svg',
                        messageType: 'service'
                    });
                }
            });
        }
    }

}());