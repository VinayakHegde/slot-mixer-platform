import Register from './../../services/registery.service';

const viewId = (ngShowDirective) => {
    const ngShow = ngShowDirective[0];

    const directive = {
        priority: ngShow.priority,
        terminal: ngShow.terminal,
        restrict: ngShow.restrict,
        link: directiveLink,
        bindToController: {},
        require: { view: 'view' },
        controllerAs: '$ctrl',
        controller: () => {}
    };

    return directive;

    function directiveLink($scope, $element, $attrs, $ctrls) {
        $attrs.ngShow = () => {
            if ($attrs.position == 'bottom') return true;
            return $ctrls.view.isActive;
        };
        ngShow.link.apply(ngShow, arguments);
    }
}
viewId.$inject = ['ngShowDirective'];
Register.directive('viewId', viewId);