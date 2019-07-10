/* Directive Name: eject-card
 * When used with element, ejects the customer card on tap/press/click.
 * 
 * Usage:
 * <button eject-card>Eject Card</button>
 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('ejectCard', ejectCard);
	ejectCard.$inject = ['webSocketService', 'navigationService', 'hammerService', 'customerService'];
	function ejectCard(webSocketService, navigationService, hammerService, customerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            hammerService.addTap($element, function () {
                webSocketService.ejectCard();
				$scope.setCustomer();
				customerService.clear();
                navigationService.navigateScreen();
            });
        }
    }

})();
