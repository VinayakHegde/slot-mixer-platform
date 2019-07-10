import Register from './../../services/registery.service';
const directiveLink = (navigationService, hammerService) => ($scope, $element, $attrs) => {
    hammerService.addTap($element, function () {
        navigationService.navigateScreen($attrs.linkTo, $attrs.selfHideMessage ? null : $scope.setMessageObject);
    });
}
const linkTo = (navigationService, hammerService) => {
    const directive = {
        restrict: "A",
        link: directiveLink(navigationService, hammerService)
    };

    return directive;
}
linkTo.$inject = ['navigationService', 'hammerService'];

Register.directive('linkTo', linkTo);