/* Directive Name: web-site
 * It displays external content on an iframe when external-resource is defined.  Any attributes in the web-site tag will also apply to the element it creates.
 * 
 * Usage:
 * <web-site width="100%" height="100%"
 *           external-resource="https://about.gambleaware.org/" >
 * </web-site>
 * 
 */
import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('swWidgets')
        .directive('webSite', webSite);
    function webSite() {
        var directive = {
            template: '<iframe sandbox frameborder="0"></iframe>',
            restrict: 'E',
            replace: true
        };

        return directive;
    }

})();