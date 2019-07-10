(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .decorator('$templateRequest', templateRequestDecorator);

    templateRequestDecorator.$inject = ['$delegate', '$templateCache'];
    function templateRequestDecorator($delegate, $templateCache) {
        return function (template) {
            return $delegate(template).then(function () {
                if (template == '') {
                    return '<screen-not-implemented screen="'.concat(template, '"></screen-not-implemented>');
                }
                if ($templateCache.get(template) == '') {
                    return '<screen-not-implemented screen="'.concat(template, '"></screen-not-implemented>');
                }
                return $templateCache.get(template);
            });
        }
    }
})();