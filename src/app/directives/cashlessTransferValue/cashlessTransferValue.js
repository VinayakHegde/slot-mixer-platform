/* Directive Name: cashless-transfer-value
 * When used with element with value, transfers the value from card to machine on tap/press/click. 
 * 
 * Usage:
 * 
 * <button cashless-transfer-value="10">Transfer £10</ button >
 * 
 */
(function () {
	'use strict';

	angular
        .module('serviceWindow')
        .directive('cashlessTransferValue', cashlessTransferValue);
    cashlessTransferValue.$inject = ['balanceTransferService', 'hammerService'];
    function cashlessTransferValue(balanceTransferService, hammerService) {
		var directive = {
			restrict: "A",
			link: directiveLink
		};

		return directive;

		function directiveLink($scope, $element, $attrs) {
			hammerService.addTap($element, function () {
                balanceTransferService.sendFunds($attrs.cashlessTransferValue);
			});
		}
	}
})();