(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('timeService', timeService);

    timeService.$inject = [];

    function timeService() {

        var api = {};

        // getTimestamp()
        // Returns the current time as a timestamp string used in the XML string.
        api.getTimestamp = function () {

            var today = new Date();

            // Set date variables.
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }

            // Set time variables.
            var hh = today.getHours();
            var mins = today.getMinutes();
            var ss = today.getSeconds();
            if (hh < 10) {
                hh = '0' + hh;
            }
            if (mins < 10) {
                mins = '0' + mins;
            }
            if (ss < 10) {
                ss = '0' + ss;
            }

            return yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + mins + ':' + ss + 'Z'
        };

        return api;
    }
})();