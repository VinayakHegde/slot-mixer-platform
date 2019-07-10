/* Directive Name: tiggerHide
 * When used with element, it hides the elements specified (by ID).
 * 
 * Usage:
 * <button tigger-hide="element-1,element-2"> Hide 1&2 </button>
 * 
 */ 
import { each } from 'underscore';
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('tiggerHide', tiggerHide);

    tiggerHide.$inject = ['hammerService'];
    function tiggerHide(hammerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            if ($attrs.tiggerHide !== '') {
                hammerService.addTap($element, function () {
                    each($attrs.tiggerHide.split(','), function (id) {
                        var element = document.getElementById(id);

                        element.classList.remove('pt-show');
                        element.classList.add('pt-hide');
                    });
                });
            }
        }
    }

})();