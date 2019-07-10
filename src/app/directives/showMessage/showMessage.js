/* Directive Name: showMessage
 * 
 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('showMessage', showMessage);
    showMessage.$inject = ['hammerService', 'messageViewService'];
    function showMessage(hammerService, messageViewService) {
        var directive = {
            restrict: "A",
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            hammerService.addTap($element, function () {
                messageViewService.set({
                    message: $attrs.showMessage || 'Default Message',
                    messageIcon: $attrs.messageIcon || null,
                    messageCssIcon: $attrs.messageCssIcon || null,
                    messageType: $attrs.messageType || 'standard'

                });
            });
        }
    }
})();