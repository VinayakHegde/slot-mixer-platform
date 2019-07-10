(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('balanceTransferService', balanceTransferService);

    balanceTransferService.$inject = ['webSocketService'];

    function balanceTransferService(webSocketService) {

        var api = {};

        api.sendFunds = webSocketService.fundsToMachine;

        api.pointsToMachinePromo = webSocketService.pointsToMachinePromo;

        return api;
    }
})();