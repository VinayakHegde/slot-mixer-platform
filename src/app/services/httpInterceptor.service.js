(function () {
    'use strict';

    /**
     * http interceptor Service
     * 
     **/
    angular
        .module('serviceWindow')
        .factory('httpInterceptorService', httpInterceptorService);

    httpInterceptorService.$inject = ['$exceptionHandler', 'configService']
    // service method
    function httpInterceptorService($exceptionHandler, configService) {

        var factoryApi = {
            //request() replaces the '~' with base url and appends build number at the end
            'request': function (config) {
                var cacheBurster = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                config.url = config.url.concat("?", cacheBurster);

                if (config.url.indexOf("~") == 0) {
                    config.url = config.url.replace("~", configService.getBaseUrl());
                }

                return config;
            },
            'responseError': function (response) {
                var message = '[HTTP responseError '.concat(response.status, '] -'),
                    errorObj = {
                        File: response.config.url || '',
                        Status: response.status,
                        Text: response.statusText
                    };

                switch (response.status) {
                    case 400: message = message.concat(' ', 'Bad Request'); break;
                    case 401: message = message.concat(' ', 'Unauthorised'); break;
                    case 403: message = message.concat(' ', 'Forbidden'); break;
                    case 404: message = message.concat(' ', 'File No Found'); break;
                    case 414: message = message.concat(' ', 'URI too long'); break;
                    case 415: message = message.concat(' ', 'Unsupported Media Type'); break;
                    case 500: message = message.concat(' ', 'Internal Server Error'); break;
                }
                $exceptionHandler(message, errorObj);

                return _.extend(response, errorObj);
            }
        };

        return factoryApi;
    }
})();
