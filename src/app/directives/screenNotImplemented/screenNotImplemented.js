(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('screenNotImplemented', screenNotImplemented);

    screenNotImplemented.$inject = ['configService'];
    function screenNotImplemented(configService) {
        var directive = {
            template: '<div class="{{className}}">{{message}}</div>',
            restrict: 'E',
            scope: true,
            replace:true,
            link: directiveLink
        };

        return directive;

        function directiveLink($scope, $element, $attrs) {
            $scope.className = 'screen-not-implemented animated fadeIn';
            $scope.message = 'Screen not implemented - please contact a member of the staff';
            if (angular.isDefined($attrs.screen)) {
                if ($attrs.screen == '') {
                    $scope.message = 'Screen Id not defined in the screen - please contact a member of the staff';
                } else if (_.isEqual($attrs.screen, configService.get('start-up-page'))) {
                    $scope.className = $scope.className.concat(" start-up");
                    $scope.message = 'Startup screen not implemented - please contact a member of the staff';

                } else if ($attrs.screen.indexOf(configService.get('path-to-template')) == -1) {
                    $scope.className = $scope.className.concat(" app-error");
                    $scope.message = 'App Error - template not found \"'.concat($attrs.screen, '\"');
                }
            }

        }
    }

})();