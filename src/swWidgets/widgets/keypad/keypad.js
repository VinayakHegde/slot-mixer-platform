import angular from 'angular';
import { isObject, isFunction } from 'underscore';
(function() {
	'use strict';

	angular.module('swWidgets').directive('keyPad', keypad);
	function keypad() {
		var directive = {
			bindToController: {
				onCompleteShow: '@'
			},
			template: require('./keypad.html'),
			transclude: false,
			restrict: 'E',
			controllerAs: '$ctrl',
			link: directiveLink,
			controller: directiveController,
			require: {
				transferFunds: '?^transferFunds',
				pinChange: '?^pinChange'
			}
		};

		return directive;

		function directiveLink($scope, $element, $attrs, $ctrls) {
			console.log('keyPad:link', $ctrls);
		}
	}

	directiveController.$inject = ['$attrs', '$scope', 'keypadService'];

	function directiveController($attrs, $scope, keypadService) {
		var self = this,
			keypads = null;

		this.$onInit = function() {
			this.currencySymbol = '';
			if (this.transferFunds) {
				if (this.transferFunds.customKeys) {
					keypadService.configureCustomKeys(this.transferFunds.customKeys);
				}

				this.currencySymbol = this.transferFunds.currencySymbol;
			}

			keypads = keypadService.getKeypads();
			this.keypad = keypads.custom;

			this.isPin = angular.isDefined($attrs.pinPad);
			this.isQwerty = this.showQwerty = angular.isDefined($attrs.qwerty);
			this.passcode = '';
			$scope.typedCode = '- - - - -';

			keypads.custom.keys.push({
				text: $scope.lang['Other'],
				callback: function() {
					self.isCustom = false;
					self.resetKeypad();
				}
			});
			if (this.isQwerty) {
				keypads.default.keys.push({
					text: $scope.lang['ABC'],
					callback: function() {
						self.showQwerty = true;
						self.resetKeypad(true);
					}
				});
				keypads.qwerty.keys.push({
					text: '123',
					callback: function() {
						self.showQwerty = false;
						self.resetKeypad(true);
					}
				});
				this.keypad = keypads.qwerty;
			} else if (!this.isPin) {
				keypads.default.keys.push({
					text: $scope.lang['Back'],
					callback: function() {
						self.isCustom = true;
						self.resetKeypad();
					}
				});
			}

			this.isCustom = !this.isPin && !this.isQwerty;
			this.resetKeypad();
		};

		this.$postLink = function() {};

		this.resetKeypad = function(retainValue) {
			if (!retainValue) {
				this.resetValue('');
			}
			this.keypad = this.showQwerty ? keypads.qwerty : this.isCustom ? keypads.custom : keypads.default;
		};

		this.resetValue = function(value) {
			if (this.isQwerty) {
				if (isObject(value) && isFunction(value.callback)) {
					value.callback();
				} else {
					if (value === '') {
						$scope.typedCode = '- - - - -';
					} else {
						$scope.typedCode = $scope.typedCode.replace('-', value); //(value && ($scope.typedCode += value)) || '';

						if ($scope.typedCode.indexOf('-') === -1 && $scope.typedCode.replace(/ /gi, '').length === 5) {
							this.onConfirm();
						}
					}
				}
			} else if (!this.isPin) {
				if (isObject(value) && isFunction(value.callback)) {
					value.callback();
				} else {
					if (!this.isCustom && value !== '') {
						value = formatTrensferValue(value);
					} else {
						if (value !== '') {
							value = Number(value) + Number($scope.transferValue.toString().replace(this.currencySymbol, ''));
						}
						value = this.currencySymbol.concat(
							value.toString(),
							value !== '' ? keypadService.decimalSeperator : '0' + keypadService.decimalSeperator,
							'00'
						);
					}

					$scope.setTransferValue(value);
				}

				console.log('keypad : resetValue', $scope.transferValue);
			} else {
				if (value == '') {
					this.passcode = value;
				}
				if (this.passcode.length + 1 > 4) {
					return;
				}

				this.passcode = this.passcode.concat(value);
				console.log('keypad : resetValue', this.passcode);

				if (this.transferFunds) {
					this.transferFunds.updateMaskedPin(keypadService.maskPin(this.passcode.length));
				}
				if (this.pinChange) {
					this.pinChange.updateMaskedPin(keypadService.maskPin(this.passcode.length));
				}
			}
		};

		this.formattedKey = function(key) {
			if (isObject(key)) {
				return key.text;
			}

			return this.isCustom ? this.currencySymbol.concat(key) : key;
		};

		this.getButtonClass = function(key) {
			var cls = 'other';
			if (isObject(key)) {
				return this.isCustom ? cls : cls.concat('2');
			} else if (!this.isPin && !this.isCustom && key == 0) {
				return cls.concat('1');
			}
		};

		this.$onDestroy = function() {
			//this.resetValue('');
		};
		this.onConfirm = function() {
			console.log('keypad:on confirm');

			if (this.isQwerty && $scope.typedCode.indexOf('-') === -1 ) {
				if (this.onCompleteShow) {
					keypadService.navigateScreen(this.onCompleteShow, null);
				}
			}

			// is parent transferFunds?
			if (this.transferFunds) {
				console.log('keypad:has parent transferFunds');
				var fund = Number($scope.transferValue.toString().replace(this.currencySymbol, ''));
				if (angular.isDefined($attrs.confirm) && this.passcode.length === 4) {
					this.transferFunds.processTransferFunds(fund, this.passcode);
				} else if (fund > 0) {
					this.transferFunds.confirmTransfer();
				}
			}
			// is parent pinChange?
			if (this.pinChange) {
				if (this.passcode.length === 4) {
					this.pinChange.confirmChange(this.passcode);

					this.passcode = '';
				}
			}
		};

		function formatTrensferValue(value) {
			// decimalSeparator is culture specific
			// TODO - consider taking culture specific decimal seperator
			var val = $scope.transferValue
					.toString()
					.replace(self.currencySymbol, '')
					.replace(keypadService.decimalSeperator, ''),
				temp = val.concat(value);
			if (Number(temp) > keypadService.MAX_POSSIBLE_TRANSFER_AMOUNT) {
				return $scope.transferValue.toString();
			} else {
				val = val.concat(value);
			}
			if (val == 0) {
				return '0'.concat(keypadService.decimalSeperator, '00');
			}

			if (val.length < 3) {
				for (var i = 0; i < 3 - val.length; i++) {
					val = '0'.concat(val);
				}
			}
			var part1 = Number(val.substr(0, val.length - 2)).toString();
			return self.currencySymbol.concat(part1, keypadService.decimalSeperator, val.substr(val.length - 2));
		}
	}
})();
