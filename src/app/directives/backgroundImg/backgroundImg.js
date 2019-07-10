/* Directive Name:background-img
 * When used with element, it sets the background image css property for the element.
 * 
 * Usage:
 * <div background-img="playtech-card.svg"></div>
 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('backgroundImg', backgroundImg);

    backgroundImg.$inject = ['configService'];
    function backgroundImg(configService) {
        var directive = {
            restrict: 'A',
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            if ($attrs.backgroundImg.length > 0) {
                var img = configService.get('path-to-media').replace('~', '').concat($attrs.backgroundImg);
                $element.css({
                    'background-image': 'url('.concat(img, ')'),
                    'background-size': 'cover'
                });
            }

        }
    }
})();