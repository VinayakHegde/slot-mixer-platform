/* Directive Name : message-view
 * When used as element, shows the element as message box on left side panel  if messageObject object not null.#
 * 
 * Usage:
 * <message></message>
 */
(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .directive('messageView', messageView);

    messageView.$inject = ['hammerService'];
    function messageView(hammerService) {
        var directive = {
            restrict: 'E',
            template: getTemplate,
            link: directiveLink
        };

        return directive;

        function getTemplate() {
            return '<div ng-class="messageObject.className" class="notifier animated fadeIn message-view-content" >'
                + '<img class="icon animated largePulse infinite" ng-if="messageObject.imgSource" media="{{messageObject.imgSource}}" />'
                + '<span ng-if="messageObject.iconClass" ng-class="messageObject.iconClass" style="margin-left: 20px"></span>'
                + '<span class="message-view-msg" ng-if="messageObject.message">{{ messageObject.message }}</span>'
                + '</div>';
        }

        function directiveLink($scope, $element, $attrs) {
            hammerService.addTap($element, function () {
                $scope.setMessageObject();
            });
        }
    }

})();