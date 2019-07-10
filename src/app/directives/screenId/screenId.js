/* Directive Name : screen-id
 * It should be used only with tag directive called screen. This directive make sure to render the named screen only if it is active screen/shared screen.
 * 
 * Attributes can be used with screen-id directive are:
 * i.	on-authorise=”show”
 * renders the screen only after customer card in
 * 
 * ii.	on-authorise=”hide”
 * removes the screen after customer card in
 * 
 * iii.	shared-for=”layout-name”
 * this attribute let the directive know that screen is a shared screen on the layout
 * 
 * Usage 1:
 * <view view-id position="bottom">
 *      <screen screen-id="attract-1" on-authorise="hide"></screen>
 *      <screen screen-id="bottom-view" on-authorise="show"></screen>
 * </view>
 * 
 * Usage 2:
 * <view view-id="un-authorised-layout" position="left">
 *      <screen screen-id="promo" shared></screen>
 *      <screen screen-id="brochure"></screen>
 *      <screen screen-id="sign-up"></screen>
 * </view>
 */ 
(function () {
    'use strict';
    angular
        .module('serviceWindow')
        .directive('screenId', screenId);

    screenId.$inject = ['ifBaseService', 'navigationService'];
    function screenId(ifBaseService, navigationService) {
        var BOTTOM = 'bottom';

        return new ifBaseService.directive(fnIf, fnLink, { require: { view: '?^view' } });

        function fnIf($scope, $element, $attrs, $ctrls) {
            var screenBelongsTo = $attrs.belongsTo,
                isViewActive = navigationService.isActiveView(screenBelongsTo),
                isScreenActive = navigationService.isActiveScreen($attrs.screenId) && isViewActive,
                isSharedScreen = (angular.isDefined($attrs.sharedFor) || angular.isDefined($attrs.shared));

            if (angular.isDefined($attrs.screenIfCardin)) {
                if ($attrs.screenPosition == BOTTOM) {
                    return $scope.customer;
                } else {
                    if (isSharedScreen) {
                        return $scope.customer && isViewActive;
                    }
                    return $scope.customer && isScreenActive;
                }
            }
            if (angular.isDefined($attrs.screenIfCardout)) {
                if ($attrs.screenPosition == BOTTOM) {
                    return !$scope.customer;
                } else {
                    if (isSharedScreen) {
                        return !$scope.customer && isViewActive;
                    }
                    return !$scope.customer && isScreenActive;
                }
            }

            if ($attrs.screenPosition == BOTTOM) {
                return true;
            }

            if (isSharedScreen) {
                return isViewActive;
            }

            return isScreenActive;
        }

        function fnLink($scope, $element, $attrs, $ctrls) {
            $element.addClass($attrs.screenId);

            if ($attrs.screenId !== '' || $ctrls.view.position == BOTTOM) {
                if ($ctrls.view) {
                    $ctrls.view.registerScreen({ name: $attrs.screenId });
                    $attrs.screenPosition = $ctrls.view.position;
                    $attrs.belongsTo = $ctrls.view.name;

                    if ($ctrls.view && $ctrls.view.viewIfCardin) {
                        $attrs.screenIfCardin = '';
                    }
                    if ($ctrls.view && $ctrls.view.viewIfCardout) {
                        $attrs.screenIfCardout = '';
                    }
                }
            } else {
                var childScope = $scope.$new();
                childScope.$destroy();
                console.warn('Screen Id is empty. Destroying it:', $element[0]);
                $element.remove();
                childScope = null;
            }
        }
    }

})();