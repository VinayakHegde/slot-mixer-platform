/* Directive Name : if-view
When used with element, renders the element if parent view is active.

Usage:
<div if-view> I will be shown if parent view is active  </div>
 * 
*/

(function () {
    'use strict';
    angular
        .module('serviceWindow')
        .directive('ifView', ifView);

    ifView.$inject = ['ifBaseService'];

    function ifView(ifBaseService) {
        return new ifBaseService.directive(function fnIf($scope, $element, $attrs, $ctrls) {
            return !$element.parent().hasClass('ng-hide');
        });
    }

})();