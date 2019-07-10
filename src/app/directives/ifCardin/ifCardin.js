/* Directive Name : if-cardin
 * When used with element, renders the element if customer object not null.
 * 
 * Usage:
 * <div if-cardin> Customer Specific Info goes here </div>
 * 
*/

(function () {
    'use strict';
    angular
        .module('serviceWindow')
        .directive('ifCardin', ifCardin);

    ifCardin.$inject = ['ifBaseService'];
    function ifCardin(ifBaseService) {
        return new ifBaseService.directive(function fnIf($scope, $element, $attrs, $ctrls) {
            return $scope.customer;
        });
    }

})();