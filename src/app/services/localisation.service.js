(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('localisationService', localisationService)
    localisationService.$inject = ['$rootScope'
        , '$http'
        , 'variableService'
        , 'dictionaryService'
        , 'configService'
    ];
    // localisationService
    // This service hosts the localisation routines.
    function localisationService($rootScope
        , $http
        , variableService
        , dictionaryService
        , configService
    ) {

        var api = {},
            // Holds an language pack of loaded dictionaries.
            // This is to save time having to reload the dictionaries from the server.
            dictionaryStorage = {};

        // getDictionary() returns the current dictionary. Note that arrays are passed as a reference in javaScript.
        api.getDictionary = function (cultureCode) {
            var currentCulture = cultureCode || api.getCurrentCulture();

            if (!currentCulture) return null;

            return dictionaryStorage[currentCulture];

        }

        // setLanguage() attempts to retrieve the dictionary for the supplied culture code.
        // If not found, the default dictionary will be returned from the server.
        // Parameters:
        //  cultureCode:        The required culture code e.g. 'en', 'fr', 'en-GB' etc.
        //  informUser:         Set to true if we want to display the LanguageChanged message (defaults to false).
        api.setLanguage = function (cultureCode, informUser, callback) {
            function isCultureExist() {
                if (dictionaryStorage[cultureCode]) {
                    // Set a system variable to be used by the website (this will be reset when we return to attract mode).
                    variableService.set("currentCulture", cultureCode);
                    var params = {
                        dict: dictionaryStorage[cultureCode],
                        // Default inform user is false.
                        informUser: informUser || false
                    };
                    // Let the system know we have loaded a new dictionary.
                    if (callback) {
                        callback(params)
                    } else {
                        $rootScope.$broadcast('gotDictionary', params);
                    }

                    // Dictionary for the culture already loaded so no need for any processing.
                    return true;
                }
                return false;
            }

            function fnOnSuccess(result) {
                // Add the returned dictionary to the dictionaryStorage;
                dictionaryStorage[cultureCode] = dictionaryService.construct(result.data, 'id', 'literal');

                console.log('[localisationService] - language file downloaded', dictionaryStorage);

                isCultureExist();
            }
            function fnOnFailure(error) {
                // Indicate to the user that we could not load the dictionary.
                //TODO - on error function should be passed from callee
                //messageService.message(null, "Could not load the dictionary for the selected language.", "", "", true, 0);

                // We do not want to revert the currentCulture variable as we may
                // be using the currentCulture variable to display items on the screen with
                // hard-coded text values.

                console.log('[localisationService] - error downloading the language file', error);
            }
            if (!isCultureExist()) {
                // Call the server to get the dictionary for the supplied culture code.
                $http.get(configService.get("path-to-language").concat(cultureCode.toLowerCase(), '.json'))
                    .then(fnOnSuccess, fnOnFailure);
            }
        }

        // get() returns the value stored in the dictionary list.
        //  key - the key to get the value of.
        api.get = function (key) {
            var dict = api.getDictionary(),
                literal = dict ? dict[key] : null;

            return (!literal || literal == "") ? "A dictionary entry does not exist for id '".concat(key, "'.") : literal;
        }

        // getCurrentCulture()
        // Returns the current dictionary culture or an empty string if no dictionary set yet.
        api.getDictionaryCulture = function () {

            return api.getCurrentCulture();
        }

        api.getCurrentCulture = function () {
            return variableService.get("currentCulture");
        }

        return api;
    }

}());