(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('dictionaryService', dictionaryService);

    function dictionaryService() {

        var api = {};

        api.construct = function (data, key, value) {
            var dict = {};
            if (data) {
                console.log('[dictionaryService] - constructing dictionary : ', data);
                if (angular.isArray(data) && data.length) {
                    angular.forEach(data, function (dt) {
                        dict[dt[key]] = dt[value];
                    });
                } else if (angular.isObject(data)) {
                    dict = data;
                }

            }

            return dict;
        }

        return api;
    }
})();