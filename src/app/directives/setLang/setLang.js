/* Directive Name : set-lang
 * When used with element, it changes the app language on tap/press/click.
 * 
 * Usage:
 * <button set-lang="en-gb">English</button>
 */

(function() {
	'use strict';

	angular.module('serviceWindow').directive('setLang', setLang);

	setLang.$inject = ['localisationService', 'webSocketService', 'hammerService'];
	function setLang(localisationService, webSocketService, hammerService) {
		var directive = {
			restrict: 'A',
			link: directiveLink
		};

		return directive;

		function directiveLink($scope, $element, $attrs) {
			hammerService.addTap($element, function() {
				// If the element is tapped, change the dictionary to the specified language.

				// Only need to set the language if it is not already set.
				if (localisationService.getDictionaryCulture() != $attrs.setLang) {
					// Set the language.
					localisationService.setLanguage($attrs.setLang, $attrs.informUser, $scope.setLang);

					if ($scope.customer) {
						$scope.customer.language = $attrs.setLang;
					}

					// Let the server know we have changed the language for the customer.
					webSocketService.setCustomerLanguage($attrs.setLang);
				}
			});
		}
	}
})();
