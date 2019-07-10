/* Directive Name: display-after
 * When used with element, it displays the element after specified second.
 * 
 * Usage:
 * <div display-after="5">I am visible after 5 seconds</div>
 * 
 */ 
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('displayAfter', displayAfter);

    displayAfter.$inject = ['$timeout'];
    function displayAfter($timeout) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {

            if ($attrs.displayAfter !== '' && Number($attrs.displayAfter) > 0) {
                $element.addClass('ng-hide');

                var timeout = Number($attrs.displayAfter) * 1000;

                $timeout(function () {
                    $element.removeClass('ng-hide');
                }, timeout);
            }
        }
    }
})();