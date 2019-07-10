import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('swWidgets')
        .directive('radialGauge', targetMeter);

    function targetMeter() {
        var directive = {
            template: require('./radialGauge.html'),
            restrict: 'E',
            scope: {
                "target": "=target",
                "actual": "=actual",
                "cssClass": "@cssClass",
				"caption": "@caption"
			}
        };

		return directive;
	}

})();
