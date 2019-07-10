import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('swWidgets', [])
        .config(configModule)
        .run(runModule);

    configModule.$inject = [];
    function configModule() {

    }

    runModule.$inject = [];
    function runModule() {
        console.log("Run swWidgets module");
    }

})();
