/* Directive Name: toggle
When used with element, it toggles the visibility the elements specified (by ID). If no ids specified, then the element itself toggles its visibility.
Usage:
<button toggle="element-1,element-2"> Toggle 1&2 </button>
<button toggle>Hide me</button>

 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('toggle', toggle);

    toggle.$inject = ['hammerService'];
    function toggle(hammerService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            

            hammerService.addTap($element, function () {
                if ($attrs.toggle !== '') {
                    _.each($attrs.toggle.split(','), function (id) {
                        var element = $('#'.concat(id));

                        element.toggleClass('pt-hide');
                    });
                } else {
                    $element.toggleClass('pt-hide');
                }
            });
        }
    }

})();