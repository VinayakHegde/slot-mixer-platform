import Register from '../services/registery.service';
import { isObject, isFunction, isUndefined } from 'underscore';

class Keypad{
	static get $inject(){
		return ['$attrs', '$scope', 'keypadService'];
	}

	constructor($attrs, $scope, keypadService){
		this.$attrs = $attrs;
		this.$scope = $scope;
		this.keypadService = keypadService;
	}

	$onInit() {
		this.currencySymbol = '';
		if (this.transferFunds) {
			if (this.transferFunds.customKeys) {
				this.keypadService.configureCustomKeys(this.transferFunds.customKeys);
			}

			this.currencySymbol = this.transferFunds.currencySymbol;
		}

		this.keypads = this.keypadService.getKeypads();
		this.keypad = this.keypads.custom;

		this.isPin = !isUndefined(this.$attrs.pinPad);
		this.isQwerty = this.showQwerty = !isUndefined(this.$attrs.qwerty);
		this.passcode = '';
		this.$scope.typedCode = '- - - - -';

		this.keypads.custom.keys.push({
			text: this.$scope.lang['Other'],
			callback: () => {
				this.isCustom = false;
				this.resetKeypad();
			}
		});
		if (this.isQwerty) {
			this.keypads.default.keys.push({
				text: this.$scope.lang['ABC'],
				callback: () => {
					this.showQwerty = true;
					this.resetKeypad(true);
				}
			});
			this.keypads.qwerty.keys.push({
				text: '123',
				callback: () => {
					this.showQwerty = false;
					this.resetKeypad(true);
				}
			});
			this.keypad = this.keypads.qwerty;
		} else if (!this.isPin) {
			this.keypads.default.keys.push({
				text: this.$scope.lang['Back'],
				callback: () => {
					this.isCustom = true;
					this.resetKeypad();
				}
			});
		}

		this.isCustom = !this.isPin && !this.isQwerty;
		this.resetKeypad();
	};

	resetKeypad(retainValue) {
		if (!retainValue) {
			this.resetValue('');
		}
		this.keypad = this.showQwerty ? this.keypads.qwerty : this.isCustom ? this.keypads.custom : this.keypads.default;
	};

	resetValue(value) {
		if (this.isQwerty) {
			if (isObject(value) && isFunction(value.callback)) {
				value.callback();
			} else {
				if (value === '') {
					this.$scope.typedCode = '- - - - -';
				} else {
					this.$scope.typedCode = this.$scope.typedCode.replace('-', value);

					if (this.$scope.typedCode.indexOf('-') === -1 && this.$scope.typedCode.replace(/ /gi, '').length === 5) {
						this.onConfirm();
					}
				}
			}
		} else if (!this.isPin) {
			if (isObject(value) && isFunction(value.callback)) {
				value.callback();
			} else {
				if (!this.isCustom && value !== '') {
					value = this.formatTrensferValue(value);
				} else {
					if (value !== '') {
						value = Number(value) + Number(this.$scope.transferValue.toString().replace(this.currencySymbol, ''));
					}
					value = this.currencySymbol.concat(
						value.toString(),
						value !== '' ? this.keypadService.decimalSeperator : '0' + this.keypadService.decimalSeperator,
						'00'
					);
				}

				this.$scope.setTransferValue(value);
			}

			console.log('keypad : resetValue', this.$scope.transferValue);
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
				this.transferFunds.updateMaskedPin(this.keypadService.maskPin(this.passcode.length));
			}
			if (this.pinChange) {
				this.pinChange.updateMaskedPin(this.keypadService.maskPin(this.passcode.length));
			}
		}
	};

	formattedKey(key) {
		if (isObject(key)) {
			return key.text;
		}

		return this.isCustom ? this.currencySymbol.concat(key) : key;
	};

	getButtonClass(key) {
		var cls = 'other';
		if (isObject(key)) {
			return this.isCustom ? cls : cls.concat('2');
		} else if (!this.isPin && !this.isCustom && key == 0) {
			return cls.concat('1');
		}
	};

	$onDestroy() {
		this.resetValue('');
	};
	onConfirm() {
		console.log('keypad:on confirm');

		if (this.isQwerty && this.$scope.typedCode.indexOf('-') === -1 ) {
			if (this.onCompleteShow) {
				this.keypadService.navigateScreen(this.onCompleteShow, null);
			}
		}

		// is parent transferFunds?
		if (this.transferFunds) {
			console.log('keypad:has parent transferFunds');
			var fund = Number(this.$scope.transferValue.toString().replace(this.currencySymbol, ''));
			if (angular.isDefined(this.$attrs.confirm) && this.passcode.length === 4) {
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

	formatTrensferValue(value) {
		// decimalSeparator is culture specific
		// TODO - consider taking culture specific decimal seperator
		var val = this.$scope.transferValue
				.toString()
				.replace(this.currencySymbol, '')
				.replace(this.keypadService.decimalSeperator, ''),
			temp = val.concat(value);
		if (Number(temp) > this.keypadService.MAX_POSSIBLE_TRANSFER_AMOUNT) {
			return this.$scope.transferValue.toString();
		} else {
			val = val.concat(value);
		}
		if (val == 0) {
			return '0'.concat(this.keypadService.decimalSeperator, '00');
		}

		if (val.length < 3) {
			for (var i = 0; i < 3 - val.length; i++) {
				val = '0'.concat(val);
			}
		}
		var part1 = Number(val.substr(0, val.length - 2)).toString();
		return this.currencySymbol.concat(part1, this.keypadService.decimalSeperator, val.substr(val.length - 2));
	}
}
const keypad = () => {
	var directive = {
		bindToController: {
			onCompleteShow: '@'
		},
		template: require('./keypad.html'),
		transclude: false,
		restrict: 'E',
		controllerAs: '$ctrl',
		controller: Keypad,
		require: {
			transferFunds: '?^transferFunds',
			pinChange: '?^pinChange'
		}
	};

	return directive;
}
Register.directive('keyPad', keypad);