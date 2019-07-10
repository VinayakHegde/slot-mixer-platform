(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('variableService', variableService)

    // variableService() maintains a list of variable key/value pairs.
    function variableService() {

        var api = {},
            // variables contain user generated variables.
            variables = {},
            // internalVariables contain internally generated variables.
            internalVariables = {};

        // set() adds or updates a  value to the variable list.
        //  key - key to store the value under.
        //  value - the value to store.
        api.set = function (key, value) {
            variables[key] = value;
        }

        // setInternal() adds or updates an value to the internal variable list.
        //  key - key to store the value under.
        //  value - the value to store.
        api.setInternal = function (key, value) {
            internalVariables[key] = value;
        }

        // get() returns the value stored in the variable list.
        //  key - the key to get the value of.
        api.get = function (key) {
            return variables[key];
        }

        // getInternal() returns a value stored against in the internal variable list.
        //  key - the key to get the value of.
        api.getInternal = function (key) {
            return internalVariables[key];
        }

        // clear() will clear all variables in memory.
        // Called when card is inserted/removed.
        // Note: IGS Variables are not cleared as these will be holding items like error messages. 
        //       No customer related data should be held.
        api.clear = function () {
            variables = [];
        }

        return api;
    }

}());