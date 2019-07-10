/* Directive Name: points-transfer-value
 * When used with element with value, transfers the value from card to machine on tap/press/click. 
 * 
 * Usage:
 * 
 * <button points-transfer-value="10">Transfer £10</ button >
 * 
 */
(function () {
	'use strict';

	angular
        .module('serviceWindow')
        .directive('pointsTransferValue', pointsTransferValue);
    pointsTransferValue.$inject = ['balanceTransferService', 'hammerService'];
    function pointsTransferValue(balanceTransferService, hammerService) {
		var directive = {
			restrict: "A",
			link: directiveLink
		};

		return directive;

		function directiveLink($scope, $element, $attrs) {
			hammerService.addTap($element, function () {
                balanceTransferService.pointsToMachinePromo($attrs.pointsTransferValue);
			});
		}
	}
})();