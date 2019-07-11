import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('widgets')
        .directive('slide', slide);

    function slide() {
        var directive = {
            bindToController: {},
            template: getTemplate,
            transclude: true,
            replace: true,
            restrict: 'E',
            controllerAs: '$ctrl',
            scope: {},
            link: directiveLink,
            controller: directiveController
        };

        return directive;

        function getTemplate() {
            return '<div class="slide-content" ng-class="{ \'active\': $ctrl.isActive }"><div ng-if="$ctrl.isActive" ng-transclude></div></div>';
        }

        function directiveLink($scope, element, attrs, ctrls) {

        }
    }

    directiveController.$inject = [];

    function directiveController() {
        this.$onInit = function () {
            this.isActive = false;
        }

        this.$postLink = function () {
        }

        this.$onChanges = function (changes) {
        }

        this.setActive = function () {
            this.isActive = true;
        };

    }

})();