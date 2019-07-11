import angular from 'angular';
import { isString } from 'underscore';
(function() {
	'use strict';

	angular.module('widgets').factory('keypadService', keypadService);

	keypadService.$inject = ['navigationService'];

	function keypadService(navigationService) {
		var api = {},
			defaultKeypad = {
				className: 'keys-0-9',
				keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
			},
			qwertyKeypad = {
				className: 'keys-a-z',
				keys: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
			},
			customKeypad = {
				className: 'keys-std',
				keys: [5, 10, 50, 100, 150, 200, 250]
			};

		api.decimalSeperator = '.';
		api.MAX_POSSIBLE_TRANSFER_AMOUNT = 10000000;

		api.maskPin = function(length) {
			var maskedPin = '';
			if (length) {
				var stop = false;
				while (!stop) {
					maskedPin = maskedPin.concat('*');

					stop = maskedPin.length == length;
				}
			}

			return maskedPin;
		};

		api.getKeypads = function() {
			return {
				custom: JSON.parse(JSON.stringify(customKeypad)),
				default: JSON.parse(JSON.stringify(defaultKeypad)),
				qwerty: JSON.parse(JSON.stringify(qwertyKeypad))
			};
		};

		api.configureCustomKeys = function(keys) {
			if (isString(keys)) {
				keys = keys.split(',');
			}
			customKeypad.keys = keys.slice(0, 7);
		};

		api.navigateScreen = navigationService.navigateScreen;

		return api;
	}
})();
