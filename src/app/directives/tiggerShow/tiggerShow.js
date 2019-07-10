/* Directive Name: tigger-show
 * When used with element, it displays the elements specified (by ID).
 * 
 * Usage:
 * <button tigger-show="element-1,element-2"> Show 1&2 </button>
 * 
 */ 
  import { each } from 'underscore';
  (function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('tiggerShow', tiggerShow);

    tiggerShow.$inject = ['hammerService'];
    function tiggerShow(hammerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            if ($attrs.tiggerShow !== '') {
                hammerService.addTap($element, function () {
                    each($attrs.tiggerShow.split(','), function (id) {
                        var element = document.getElementById(id);

                        element.classList.add('pt-show');
                        element.classList.remove('pt-hide');
                    });
                });
            }
        }
    }

})();