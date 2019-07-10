/* Directive Name: card-in
 * When used with element, simulates the user card in on tap/click/press
 * Note: This directive not to be used in production
 * 
 * Usage:
 * <button card-in>Simulate Card-in</button>
 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('cardIn', cardIn);
    cardIn.$inject = ['simCardInService', 'navigationService', 'hammerService'];
    function cardIn(simCardInService, navigationService, hammerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs, $ctrls) {
            hammerService.addTap($element, function () {
                simCardInService.simCardIn($scope.setCustomer);
                navigationService.navigateScreen();
            });
        }
    }

})();