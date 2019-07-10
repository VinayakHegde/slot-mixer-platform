(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('simCardInService', simCardInService);

    simCardInService.$inject = ['customerService'];

    function simCardInService(customerService) {

        var api = {},
			user = {
				id: 77580,
				language: 'en-gb',
				name: 'Michael Knight',
				membership: 'Gold',
				sessionId: 77580,
				pinNotSet: true,
				typeAttributes: {
					message: '',
					promotionName: ''
				},
				sessionPoints: 0,
				totalPoints: 500,
				earnedPoints: 100,
				children: {
					Cashless: {
						cashable: 1000,
						nonCashable: 0,
						availableCashableBalance: 1250
					}
				},
				nextPointTarget: 100,
				nextPointEarned: 0
			};

        api.simCardIn = function (fnOnCustomer) {
            
            customerService.set({
                attributes: user,
                typeAttributes: user.typeAttributes,
                children: user.children
            });

            if (fnOnCustomer) fnOnCustomer(customerService.get());

        }

        return api;
    }
})();
