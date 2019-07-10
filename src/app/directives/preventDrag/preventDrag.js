/* Directive Name: prevent-drag
 * When used with element, it prevents the dragging the element.
 * 
 * Usage:
 * <img prevent-drag media="eject.svg">
 * 
 */ 
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('preventDrag', preventDrag);

    function preventDrag() {
        var directive = {
            restrict: "A",
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            $($element).on('dragstart', function (event) {
                event.preventDefault();
            });

            $($element)[0].draggable = false;
        }
    }

})();
