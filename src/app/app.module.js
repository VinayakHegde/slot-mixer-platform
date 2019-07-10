import angular from 'angular';
angular.module('serviceWindow', ['swWidgets']).config(configModule).run(runModule);

// inject any provider to the config method
configModule.$inject = ['$httpProvider'];

// config method
function configModule($httpProvider) {
    //$httpProvider.interceptors.push('httpInterceptorService');
}

runModule.$inject = [];
function runModule() {};