/* Directive Name : video-player
 * It displays video. Video player directive replaced by a video tag or iframe when media or external-resource directives defined.  Any attributes in the video player tag will also apply to the element it creates.
 * If video need to be auto-played, then use the attribute ‘autoplay’
 * 
 * Usage:
 * <!-- embed local video  – create video tag -->
 * <video-player width="540" height="304" autoplay type="video/mp4"
 *               media="playtech-virtual-sports.mp4">
 * </video-player>
 * 
 * <!-- embed youtube video – create iframe-->
 * <video-player width="540" height="304" autoplay
 *               external-resource="https://www.youtube.com/embed/hCfxcYSZKxE">
 * </video-player>
 */ 
import angular from 'angular';
(function () {
    'use strict';

    angular
        .module('widgets')
        .directive('videoPlayer', videoPlayer);
    function videoPlayer() {
        var directive = {
            template: getTemplate,
            restrict: 'E',
            scope: true,
            replace: true,
            link: directiveLink
        };

        return directive;

        function getTemplate($element, $attrs) {
            if (angular.isDefined($attrs.externalResource)) {
                return '<iframe frameborder="0" allow="{{autoplay}}"></iframe>'
            }
            return '<video autoplay="{{autoplay}}"></video>';
        }

        function directiveLink($scope, $element, $attrs) {
            $scope.autoplay = angular.isDefined($attrs.autoplay) ? 'autoplay' : '';
        }
    }

})();