import { isObject, isString } from 'underscore';
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('messageViewService', messageViewService);

    messageViewService.$inject = ['$rootScope'];

    function messageViewService($rootScope) {

        var api = {};

        api.for = {
            SERVICE_REQUESTED: 'TheAssistantHasBeenCalled',
            ENTER_NEW_PINCODE: 'PleaseEnterNewPinCode',
            CONFIRM_NEW_PINCODE: 'PleaseConfirmNewPinCode',
            PINCODE_DO_NOT_MATCH: 'YourPinAndConfirmationPinDoNotMatch',
            LANGUAGE_CHANGED: 'LanguageChanged'
        }

        api.set = function (obj) {
            var msgObj = null;
            if (isObject(obj)) {
                msgObj = {
                    className: obj.messageType ? obj.messageType.concat(' message-view') : 'message-view',
                    message: $rootScope.lang[obj.message] || obj.message
                };

                if (obj.messageIcon) {
                    msgObj.imgSource = obj.messageIcon;
                }
                if (obj.messageCssIcon) {
                    msgObj.iconClass = obj.messageCssIcon;
                }
            } else if (isString(obj)) {
                msgObj = {
                    className: 'message-view standard',
                    message: $rootScope.lang[obj] || obj
                };
            }

            $rootScope.setMessageObject(msgObj);
        }

        return api;
    }
})();