(function() {
	'use strict';

	// customerService
	angular.module('serviceWindow').factory('themeService', themeService);

	themeService.$inject = ['$rootScope'];
	// This service handles customer related functionality.
	function themeService($rootScope, configService) {
		var api = {},
			theme = 'default';

		// get()
		// Returns the current customer details.
		api.get = function() {
			return theme;
		};

		return api;
	}
})();
