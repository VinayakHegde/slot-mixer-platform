/* Directive Name : if-cardout
 * When used with element, renders the element if customer object null.
 * 
 * Usage:
 * <div if-cardout> Customer Specific Info goes here </div>
 * 
*/

(function () {
    'use strict';
    angular
        .module('serviceWindow')
        .directive('ifCardout', ifCardout);

    ifCardout.$inject = ['ifBaseService'];
    function ifCardout(ifBaseService) {
        return new ifBaseService.directive(function fnIf($scope, $element, $attrs, $ctrls) {
            return !$scope.customer;
        });
    }

})();