/* Directive Name: external-resource
 * When used with tag element, it creates an iframe with source specified.
 * 
 * Usage
 * <video-player external-resource="https://youtube.com/embed/myvidieo"></video-player>
 * 
 */ 
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('externalResource', externalResource);

    externalResource.$inject = ['srcBaseService'];
    function externalResource(srcBaseService) {
        return new srcBaseService.directive('externalResource');
    }
})();