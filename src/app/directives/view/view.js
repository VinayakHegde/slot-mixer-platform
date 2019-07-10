import { each, find, isUndefined } from 'underscore';
import Register from './../../services/registery.service';

class View{
    static get $inject(){
        return ['$scope', '$element', '$attrs', 'navigationService'];
    }
    constructor($scope, $element, $attrs, navigationService){
        this.$scope = $scope;
        this.$element = $element;
        this.$attrs = $attrs;
        this.navigationService = navigationService;

        this.name = $attrs.viewId;
        this.position = !isUndefined($attrs.position) ? $attrs.position : 'left';
        this.viewIfCardout = !isUndefined($attrs.viewIfCardout);
        this.viewIfCardin = !isUndefined($attrs.viewIfCardin);
        this.screens = [];

        // responsible for selective rendering
        this.isActive = this.position == 'bottom';
    }

    reset() {
        if (this.position !== 'bottom') {
            var isActiveView = this.navigationService.isActiveView(this.name);
            if (this.viewIfCardout) {
                this.isActive = !this.$scope.customer && isActiveView;
            } else if (this.viewIfCardin) {
                this.isActive = this.$scope.customer && isActiveView;
            } else {
                this.isActive = isActiveView;
            }
        }
        if (this.isActive) {
            this.$element.addClass("active");
        } else {
            this.$element.removeClass("active");
        }
    };
    registerScreen(screen) {
        if (!find(this.screens, { name: screen.name })) {
            this.screens.push(screen);
            return true;
        }

        return false;
    };
}
const directiveLink = ($compile, navigationService) => ($scope, $element, $attrs, $ctrl, $transclude) => {
    if ($ctrl.position == 'bottom' && !angular.isDefined($attrs.viewId)) {
        $attrs.viewId = '';
    }
    var viewIdDefined = angular.isDefined($attrs.viewId),
        hasViewId = $attrs.viewId !== '' || $ctrl.position == 'bottom',
        isViewExist = navigationService.isViewExist($ctrl);
    if (viewIdDefined && hasViewId && !isViewExist) {
        $transclude(function (clone) {
            if (angular.isDefined($attrs.shared)) {
                each($attrs.shared.split(','), function (id) {
                    if ($ctrl.registerScreen({ name: id })) {
                        var el = $compile('<screen screen-id="'.concat(id, '" screen-position="', $ctrl.position, '" belongs-to="', $attrs.viewId,  '" shared-for="', $attrs.viewId, '" class="', id, '"></screen>'))($scope);
                        $element.append(el);
                    }
                });
            }
            if (angular.isDefined($attrs.attract)) {
                if (angular.isDefined($attrs.position) && $attrs.position == 'bottom') {

                    var id = $attrs.attract.split(',')[0];

                    if ($ctrl.registerScreen({ name: id })) {
                        var el = $compile('<screen screen-id="'.concat(id, '" screen-position="', $ctrl.position, '" belongs-to="', $attrs.viewId, '" attract-screen></screen>'))($scope);
                        $element.append(el);
                    }
                }
            }

            if (angular.isDefined($attrs.screens)) {
                each($attrs.screens.split(','), function (id) {
                    if ($ctrl.registerScreen({ name: id })) {
                        var el = $compile('<screen screen-id="'.concat(id, '" screen-position="', $ctrl.position, '" belongs-to="', $attrs.viewId,  '" class="', id, '"></screen>'))($scope);
                        $element.append(el);
                    }
                });
            } else {
                $element.append(clone);
            }
        });
        navigationService.registerView($ctrl);
        console.log('View POSITION:', $ctrl.position, 'NAME:', $ctrl.name, $ctrl);
    } else {
        var childScope = $scope.$new();
        childScope.$destroy();
        $element.remove();
        if (isViewExist)
            console.warn('View exists. Destroying POSITION:', $ctrl.position, 'NAME:', $ctrl.name, $ctrl);
        if (!viewIdDefined)
            console.warn('View Id not defined. Destroying POSITION:', $ctrl.position, 'NAME:', $ctrl.name, $ctrl);
        if (!hasViewId)
            console.warn('View ID is empty. Destroying POSITION:', $ctrl.position, 'NAME:', $ctrl.name, $ctrl);
        childScope = $ctrl = null;
    }
}
const view = ($compile, navigationService) => {
    
    const directive = {
        transclude: true,
        restrict: 'E',
        link: directiveLink($compile, navigationService),
        controllerAs: '$ctrl',
        controller: View
    };

    return directive;
    
}
view.$inject = ['$compile', 'navigationService'];

Register.directive('view', view);