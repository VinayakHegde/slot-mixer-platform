/* Directive Name: display-for
 * When used with element, it displays the element for specified second.
 * 
 * Usage:
 * <div display-for="5">I am visible for 5 seconds</div>
 * 
 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('displayFor', displayFor);

    displayFor.$inject = ['$timeout'];
    function displayFor($timeout) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {

            if ($attrs.displayFor !== '' && Number($attrs.displayFor) > 0) {
                var childScope = $scope.$new();

                var timeout = Number($attrs.displayFor) * 1000;

                $timeout(function () {
                    childScope.$destroy();
                    $element.empty();
                }, timeout);
            }
        }
    }

})();