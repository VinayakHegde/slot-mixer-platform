/* Directive Name: link-start
 * When used with element, it activates the customer start screen/page specified by operator in the theme configuration.
 * 
 * Usage:
 * <button link-start>Menu</button>
 * 
 */

(function () {
    'use strict';
    angular
        .module('serviceWindow')
        .directive('linkStart', linkStart);

    linkStart.$inject = ['navigationService', 'configService', 'hammerService'];
    function linkStart(navigationService, configService, hammerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            hammerService.addTap($element, function () {
                var customerHomeScreen = configService.get('customer-home-screen'),
                    startScreen = ($scope.customer && customerHomeScreen && customerHomeScreen.length > 0
                        ? customerHomeScreen
                        : configService.get('screen-attract-left'));

                navigationService.navigateStart(startScreen, $attrs.selfHideMessage ? null : $scope.setMessageObject);
            });

        }
    }

})();