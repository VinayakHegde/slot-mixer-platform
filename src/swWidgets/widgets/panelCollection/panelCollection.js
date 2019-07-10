/** Directive Name : panel-collection
Widget displays the content in panel style. The panel directive accepts caption, expanded and icon bindings.
Panels collapsed by default, unless expanded attribute is defined
Usage:
<panel-collection>
    <panel caption="Radial Gauge" expanded>
        <radial-gauge class="session-play"
                      css-class="session"
                      caption="Games"
                      actual="25">
        </radial-gauge>
    </panel>
    <panel caption="Embed" icon="web">
        <web-site external-resource="https://about.gambleaware.org/"></web-site>
    </panel>
</panel-collection>

 */

import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('swWidgets')
        .directive('panelCollection', panelCollection);

    function panelCollection() {
        var directive = {
            bindToController: {},
            template: '<div class="tp-panel-collection" ng-transclude></div>',
            transclude: true,
            restrict: 'EA',
            controllerAs: '$ctrl',
            replace: true,
            scope: true,
            link: directiveLink,
            controller: directiveController
        };

        return directive;

        function directiveLink($scope, element, attrs, ctrls) {

        }
    }

    directiveController.$inject = ['$log'];

    function directiveController($log) {
        this.$onInit = function () {
            this.panels = [];
        };

        this.$postLink = function () {
        };

        this.$onChanges = function (changes) {
        };

        this.registerPanel = function (panel) {
            this.panels.push(panel);

            if (panel.isActive) {
                this.setActivePanel(panel);
            }
        };

        this.setActivePanel = function (panel) {
            this.panels.forEach(function(t, i) {
                t.isActive = false;
            });
            panel.isActive = true;
        };

        this.isActive = function (panel) {
            return panel.isActive;
        };

        this.closeAllBut = function (panelToExclude) {
            this.panels.forEach(function (t, i) {
                if (t !== panelToExclude) {
                    t.isActive = false;
                }
            });
        };

    }

})();