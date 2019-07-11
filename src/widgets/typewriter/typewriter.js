import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('widgets')
        .directive('typewriter', typewriter);

    function typewriter() {
        var directive = {
            bindToController: {
                text : '@',
                speed : '@',
                pause : '@',
                colors: '@'
            },
            restrict: 'E',
            controllerAs: '$ctrl',
            link: directiveLink,
            controller: directiveController
        };

        return directive;

        function directiveLink($scope, $element, $attrs, $ctrl) {
            $scope.$on('$destroy',  $ctrl.destroyTimers);
        }
    }

    directiveController.$inject = ['$element', '$attrs', '$timeout'];

    function directiveController($element, $attrs, $timeout) {
        var self = this,
            index = 0,
            colorIndex = 0,

            text = '',
            speed = 50,
            pause = 2000,
            colors = [],

            writeTimer,
            speedTimer,
            pauseTimer;

        this.$onInit = function () {
            text = this.text || $element[0].innerHTML || text;
            speed = (this.speed ? Number(this.speed) * 1000 : speed) || speed;
            pause = (this.pause ? Number(this.pause) * 1000 : pause) || pause;
            colors = this.colors ? this.colors.split(',') : colors;

            if (text.length) {
                this.typeWriter();
            }

        }

        this.typeWriter = function () {
            
            writeTimer = $timeout(function () {
                if (index < text.length) {
                    if (index == 0) $element[0].innerHTML = '';

                    $element[0].innerHTML += text.charAt(index);
                    index++;

                    self.applyColor();

                    speedTimer = $timeout(self.typeWriter, speed);
                } else {
                    if (!angular.isDefined($attrs.once)) {
                        pauseTimer = $timeout(function () {
                            $element[0].innerHTML = '';
                            index = 0;
                            self.typeWriter()
                        }, pause);
                    }
                }
            }, speed);
        }

        this.applyColor = function () {
            if (colors.length) {
                $element[0].style.color = colors[colorIndex];
                colorIndex++;

                if (colorIndex >= colors.length) colorIndex = 0;
            }
        }

        this.destroyTimers = function () {
            if (writeTimer) {
                $timeout.cancel(writeTimer);
                writeTimer = null;
            }
            if (speedTimer) {
                $timeout.cancel(speedTimer);
                speedTimer = null;
            }
            if (pauseTimer) {
                $timeout.cancel(pauseTimer);
                pauseTimer = null;
            }
        }
    }

})();