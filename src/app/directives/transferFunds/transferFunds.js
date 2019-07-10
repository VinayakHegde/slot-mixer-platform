import { isUndefined } from 'underscore';
import Register from './../../services/registery.service';

class TransferFunds{
	static get $inject(){
		return ['$scope', '$element', '$attrs', 'balanceTransferService', 'navigationService', 'hammerService'];
	}

	constructor($scope, $element, $attrs, balanceTransferService, navigationService, hammerService){
		this.$scope = $scope;
		this.$element = $element;
		this.$attrs = $attrs;
		this.balanceTransferService = balanceTransferService;
		this.navigationService = navigationService;
		this.hammerService = hammerService;

		this.cashless = !isUndefined($attrs.cashless) && isUndefined($attrs.pointsPlay);
		this.pointsPlay = !this.cashless && !isUndefined($attrs.pointsPlay);

		// for some reason £ symbol renders as the replacement character �
		// https://en.wikipedia.org/wiki/Specials_(Unicode_block)
		this.currencySymbol = $attrs.currencySymbol;

		if (!isUndefined($attrs.customKeys) && $attrs.customKeys !== '') {
			this.customKeys = $attrs.customKeys;
		}
	}

	confirmTransfer() {
		console.log('transferFunds:confirmTransfer:called on clicking confirm');
		this.confirm = true;
	};

	updateMaskedPin(maskedPin) {
		this.maskedPin = maskedPin;
	};

	processTransferFunds(fund, passcode) {
		console.log('transferFunds:processTransferFunds:called on clicking confirm on pin pad', passcode);

		if (this.cashless) {
			this.balanceTransferService.sendFunds(fund, passcode);
		}

		if (this.pointsPlay) {
			this.balanceTransferService.pointsToMachinePromo(fund, passcode);
		}
		console.log(this.onCompleteShow);
		if (this.onCompleteShow) {
			var element = document.getElementById(this.onCompleteShow);
			element.classList.add('pt-show');
			element.classList.remove('pt-hide');
			this.hammerService.addTap(element, () => {
				this.navigationService.navigateBack();
			});
		} else {
			this.navigationService.navigateBack();
		}
	};
}
const transferFunds = () => {
	var directive = {
		bindToController: {
			onCompleteShow: '@'
		},
		transclude: false,
		template: require('./transferFunds.html'),
		restrict: 'E',
		controllerAs: '$ctrl',
		controller: TransferFunds
	};

	return directive;
}

Register.directive('transferFunds', transferFunds);