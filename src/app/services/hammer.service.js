(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('hammerService', hammerService);

    // hammerService
    // This service hosts the hammer.js routines.
    // The hammer library is used to 'fix' issues on the touch device where touching the screen was not being registered correctly.
    // It adds a 'tap' even which should be bound to instead of the 'click' event.
    //
    // Note: After calling addTapToElement(), the hammer object can be accessed via $element.data("hammer").
    hammerService.$inject = ['configService'];
    function hammerService(configService) {
        
        var api = {};

        // addTap()
        // Adds the Hammer Tap recogniser to the specifiled element.
        // Params:
        //  element:        The element to added the tap event to eg. $("#elementId")
        //  threshold:      (Optional) While doing a tap the amount of movement that is allowed.
        //                  If not specified, use the value stored in the config variable "hammer-threshold".
        //                  If that is not set, use the default of 2.
        //  time:           (Optional) Maximum press time in ms.
        //                  If not specified, use the value stored in the config variable "hammer-time".
        //                  If that is not set, use the default of 250.
        api.addTap = function (element, callback) {
            if (callback) {
               if(element.bind){
                element.bind('click', callback);
               } else {
                   element.addEventListener('click', callback);
               }
            }
        };

        return api;
    }

})();