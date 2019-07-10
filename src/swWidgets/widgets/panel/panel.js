import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('swWidgets')
        .directive('panel', panel);

    function panel() {
        var directive = {
            template: getTemplate,
            transclude: true,
            restrict: 'EA',
            controllerAs: '$ctrl',
            replace: true,
            scope: true,
            bindToController: {
                caption: '@',
                icon:'@'
            },
            require: {
                panelCollection: '^panelCollection'
            },
            link: directiveLink,
            controller: directiveController
        };

        return directive;

        function getTemplate(){
            return ['<div class="tp-panel" ng-class="{ \'active\': $ctrl.isActive }">',
                '<div class="tp-panel-header" touch-callback="$ctrl.toggleActive()">',
                '<span ng-if="$ctrl.icon" class="fa" ng-class="\'fa-\'+$ctrl.icon"></span>',
                '<span class="panel-caption">{{ $ctrl.caption }}</span>',
                '<span ng-class="{\'fa-chevron-up\' : $ctrl.isActive, \'fa-chevron-down\' : !$ctrl.isActive}" class="fa"></span>',
                '</div>',
                '<div ng-if="$ctrl.isActive" class="tp-panel-body" ng-transclude></div>',
                '</div>'
            ].join('');
        }

        function directiveLink($scope, element, $attrs, ctrls) {

        }
    }

    directiveController.$inject = ['$attrs'];

    function directiveController($attrs) {
        this.$onInit = function () {
            this.isActive = angular.isDefined($attrs.expanded);
            this.panelCollection.registerPanel(this);  
        };

        this.$postLink = function () {
        };

        this.$onChanges = function (changes) {
        };

        this.toggleActive = function () {
            this.isActive = !this.isActive;
            this.panelCollection.closeAllBut(this);
        };
    }

})();