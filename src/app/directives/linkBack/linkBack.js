/* Directive Name: link-back
 * When used with element, it activates the previous screen/page seen by user.
 * 
 * Usage:
 * <button link-back>Back</button>
 * 
 */

(function () {
    'use strict';
    angular
        .module('serviceWindow')
        .directive('linkBack', linkBack);

    linkBack.$inject = ['navigationService', 'hammerService'];
    function linkBack(navigationService, hammerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            hammerService.addTap($element, function () {
                navigationService.navigateBack($attrs.selfHideMessage ? null : $scope.setMessageObject);
            });
        }
    }

})();