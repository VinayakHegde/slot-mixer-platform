/* Directive Name: tab-collection
 * Widget displays the content in tabbed style. The attribute max-visible-tabs used to set overflow tabs. The tab directive accepts caption and icon bindings.
 * 
 * Usage:
 * <tab-collection max-visible-tabs="1">
 *      <tab caption="Zelen Steakhouse">
 *           <img media="steak.jpg" />
 *           <!-- more contents can be added -->
 *      </tab>
 *      <tab caption="Dempsey Bar">
 *           <img media="bar.jpg" />
 *           <!-- more contents can be added -->
 *      </tab>
 * </tab-collection>
 * 
 */ 


import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('widgets')
        .directive('tabCollection', tabCollection);

    function tabCollection() {
        var directive = {
            bindToController: {
                maxVisibleTabs: "@"
            },
            template: require('./tabCollection.html'),
            transclude: true,
            restrict: 'E',
            controllerAs: '$ctrl',
            scope: true,
            link: directiveLink,
            controller: tabCollectionController
        };

        return directive;


        function directiveLink($scope, element, attrs, ctrls) { 
        }

    }

    function tabCollectionController() {
        this.$onInit = function () {
            this.tabs = [];
            this.setOverflowMenu(false);

            if (!this.maxVisibleTabs) {
                this.maxVisibleTabs = 1;
            } 
        }

        this.registerTab = function (tab) {
            tab.index = this.tabs.length;
            this.tabs.push(tab);
            if (this.tabs.length == 1) {
                tab.isActive = true;               
            }
        }

        this.setActiveTab = function (tab) {
            if (tab.index > this.maxVisibleTabs - 1) {
                this.tabs.splice(this.maxVisibleTabs - 1, 0, this.tabs.splice(tab.index, 1)[0]);
            }
            
            _.each(this.tabs, function (t, i){
                t.index = i;
                t.isActive = false;
            });

            this.setOverflowMenu(false);

            tab.isActive = true;
        }

        this.isOverflowTabActive = function () {
            var ovt = this.overflowTabs();

            for (var i = 0; i < ovt.length; i++) {
                if (ovt.isActive) {
                    return true;
                }
            }
            return false;
        }

        this.setOverflowMenu = function (flag) {
            this.overflowMenu = flag;
        }

        this.primaryTabs = function () {
            return this.tabs.slice(0, this.maxVisibleTabs);
        }

        this.overflowTabs = function () {
            return this.tabs.slice(this.maxVisibleTabs, this.tabs.length);
        }

    }

})();