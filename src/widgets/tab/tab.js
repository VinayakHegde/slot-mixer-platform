import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('widgets')
        .directive('tab', tab);

    function tab() {
        var directive = {
            bindToController: {
                caption: '@',
                icon: '@'
            },
            require: {
                tabCollection: '^tabCollection'
            },
            template: '<div class="tab-collection-tab" ng-transclude ng-show="$ctrl.isActive"></div >',
            transclude: true,
            restrict: 'EA',
            replace: true,
            controllerAs: '$ctrl',
            scope: true,
            link: directiveLink,
            controller: tabController
        };

        return directive;

        function directiveLink($scope, element, attrs, ctrls) {

        }
    }

    tabController.$inject = ['$log'];

    function tabController($log) {
        this.$onInit = function () {
            this.isActive = false;
            this.tabCollection.registerTab(this);
        };

        this.$onChanges = function (changes) {

        };
    }

})();