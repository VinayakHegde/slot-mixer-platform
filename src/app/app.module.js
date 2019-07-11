import angular from 'angular';
angular.module('serviceWindow', ['widgets']).config(configModule).run(runModule);

configModule.$inject = [];
function configModule() {}

runModule.$inject = [];
function runModule() {};