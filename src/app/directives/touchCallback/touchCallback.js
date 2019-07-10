/* Directive Name: touch-callback
 * It accepts a function and when is used with element, it call the function passed in on tap/press/click.
 * 
 * Usage:
 * <button touch-callback="function(){alert('I am called.')}">
 *         Call a function
 * </button>

 * 
 */ 
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('touchCallback', touchCallbackDir);
    touchCallbackDir.$inject = ['hammerService'];
    function touchCallbackDir(hammerService) {
        var directive = {
            restrict: "A",
            link: directiveLink,
            scope: {
                touchCallback: '&'
            }
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            if (_.isFunction($scope.touchCallback)) {
                hammerService.addTap($element, function () {
                    $scope.$evalAsync(function () {
                        $scope.touchCallback();
                    });
                });
            }
        }
    }

})();
