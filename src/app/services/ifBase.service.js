import { extend } from 'underscore';
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('ifBaseService', ifBaseService);

    ifBaseService.$inject = ['ngIfDirective'];
    function ifBaseService(ngIfDirective) {

        function directive(subIf, fnLink, options) {
            var ngIf = ngIfDirective[0];

            this.transclude = ngIf.transclude;
            this.priority = ngIf.priority;
            this.terminal = ngIf.terminal;
            this.restrict = ngIf.restrict; // restricted to 'A'

            this.link = function ($scope, $element, $attrs, $ctrls) {
                function fnIf() {
                    return subIf($scope, $element, $attrs, $ctrls);
                }

                $attrs.ngIf = function () { return fnIf(); };
                ngIf.link.apply(ngIf, arguments);

                if (fnLink) fnLink($scope, $element, $attrs, $ctrls);
            }
            extend(this, options || {});

            return this;
        }

        return {
            directive: directive
        };
    }
})();