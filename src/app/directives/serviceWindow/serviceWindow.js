import Register from './../../services/registery.service';

class ServiceWindow {
	static get $inject(){ 
		return [
			'$scope',
			'$element',
			'$timeout',
			'webSocketService',
			'localisationService',
			'navigationService',
			'configService',
			'messageViewService',
			'customerService'
		];
	}
	constructor(
		$scope,
		$element,
		$timeout,
		webSocketService,
		localisationService,
		navigationService,
		configService,
		messageViewService,
		customerService
	){
		this.$scope = $scope;
		this.$element = $element;
		this.$timeout = $timeout;
		this.webSocketService = webSocketService;
		this.localisationService = localisationService;
		this.navigationService = navigationService;
		this.configService = configService;
		this.messageViewService = messageViewService;
		this.customerService = customerService;
	}
	initScope () {
		let messageTimer = null,
			extendedScope = {
				// language dictionary pack
				lang: {},
				setLang : (args) => {
					this.$scope.$evalAsync(() => {
						// Store the dictionary details locally for ease of access in HTML.
						this.$scope.lang = args.dict;
						console.log(args.dict);
						// Check if we should inform the user the language has changed.
						if (args.informUser) {
							this.messageViewService.set(messageViewService.for.LANGUAGE_CHANGED);
						}
					});
				},

				customer: null,
				setCustomer : (customer) => {
					this.$scope.$evalAsync(() => {
						if ((!this.$scope.customer && customer) || (this.$scope.customer && !customer)) {
							this.navigationService.navigateScreen('');
						}
						this.$scope.customer = customer || null;

						if (!this.$scope.customer) {
							// set messageObject null
							this.$scope.setMessageObject();
						} else {
							this.webSocketService.getConfiguration();
						}

						this.localisationService.setLanguage(
							this.$scope.customer ? this.$scope.customer.language : this.configService.get('default-language'),
							false,
							this.$scope.setLang
						);

						console.log('Service Window : Customer object:', this.$scope.customer, this.navigationService);
					});
				},

				messageObject: null,
				setMessageObject : (msgObj) => {
					this.$scope.$evalAsync(() => {
						this.$scope.messageObject = msgObj || null;

						if (this.$scope.messageObject && !messageTimer) {
							messageTimer = this.$timeout(() => {
								this.$scope.setMessageObject();
							}, this.configService.get('message-display-duration') * 1000 || 99999);
						}

						if (!this.$scope.messageObject && messageTimer) {
							this.$timeout.cancel(messageTimer);
						}

						console.log('Service Window : message-view object:', this.$scope.messageObject);
					});
				},

				transferValue: '0.00',
				setTransferValue: (value) => {
					this.$scope.$evalAsync(() => {
						this.$scope.transferValue = value || '0.00';
					});
				}
			};
		angular.extend(this.$scope, extendedScope);
	};

	addClass() {
		this.$element.addClass(this.configService.get('service-window-class'));
	};

	$onInit() {
		this.initScope();
		this.addClass();
		this.webSocketService.initialise({
			callbacks: {
				fnShowMessage: this.messageViewService.set,
				fnOnCustomer: () => {
					this.$scope.setCustomer(this.customerService.get());
				}
			},
			services: {
				configService: this.configService,
				customerService: this.customerService
			}
		});

		this.localisationService.setLanguage(
			this.$scope.customer ? this.$scope.customer.language : this.configService.get('default-language'),
			false,
			this.$scope.setLang
		);
	};
}
const serviceWindow = (configService) => {
	const directive = {
		bindToController: {},
		templateUrl: configService.get('start-up-page'),
		restrict: 'E',
		controller: ServiceWindow
	};

	return directive;
}

serviceWindow.$inject = ['configService'];

Register.directive('serviceWindow', serviceWindow);