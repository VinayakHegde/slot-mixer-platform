/* Directive Name: media
 * When used with tag element, it sets the specified source path to theme/media folder.
 * 
 * Usage
 * <img media="eject.svg">
 * 
 */ 
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('media', media);
    
    media.$inject = ['srcBaseService'];
    function media(srcBaseService) {
        return new srcBaseService.directive('media');
    }
})();