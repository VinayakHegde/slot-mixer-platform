/* Directive Name: theme

Theme is the directive accepts all app (theme) settings. Theme wraps the views and screens.
The settings attribute that theme accepts are as follows:
•	default-language – default value is ‘en-gb’
•	customer-home-screen – default value none. If this is not specified sometimes user will see screen not implemented message
•	message-display-duration – default value is 5 seconds.
•	path-to-template – default path is ‘~/theme/templates/’
•	path-to-media – default path is ‘~/theme/media/’
•	path-to-language – default path is ‘~/theme/languages/'
Usage:
<theme default-language="es-es"
       customer-home-screen="main-menu"
       message-display-duration="2">
    <!-- View 1 -->
    <!-- View 2 -->
    <!-- Bottom View -->
</theme>

 */

(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('theme', theme);
    theme.$inject = ['$compile', 'configService'];
    function theme($compile, configService) {
        var directive = {
            transclude: true,
            restrict: 'E',
            link: directiveLink,
        };

        return directive;

        function directiveLink($scope, $element, $attrs, $ctrls, $transclude) {
            angular.forEach($attrs, function (val, key) {
                var attrName = $attrs.$attr[key];
                if (attrName) {
                    configService.set(attrName, val);
                }
                
            });

            $transclude(function (clone) {
                var el = $compile('<message-view ng-if="messageObject"></message-view>')($scope);
                $element.append(el);
                $element.append(clone);
            });
        }
    }
})();