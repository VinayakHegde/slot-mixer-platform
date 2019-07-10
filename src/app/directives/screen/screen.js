import Register from './../../services/registery.service';

const fnTemplateUrl = (configService) => ($element, $attrs) => {
    if ($attrs.screenId && $attrs.screenId !== '')
        return configService.get('path-to-template').concat($attrs.screenId, '.html');
    return '';
}

const screen = (configService) => {
    const directive = {
        templateUrl: fnTemplateUrl(configService),
        restrict: 'E'     
    };

    return directive;
}
screen.$inject = ['configService'];

Register.directive('screen', screen);