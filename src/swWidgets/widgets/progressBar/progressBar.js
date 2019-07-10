import angular from 'angular';
(function() {
  "use strict";

  angular.module("swWidgets").directive("progressBar", progressBar);

  function progressBar() {
    var directive = {
      restrict: "E",
      scope: {
        caption: "@caption",
        target: "=target",
        progress: "=progress",
        vertical: "=vertical",
        animation: "@animation",
        animationHigh: "@animationHigh",
        icon: "@icon"
      },
      template:
        '<div class="progress-bar-wrapper" style="background-color: rgba({{colour}}, 0.2)">' +
        '<div class="progress-bar-content">' +
        '<div class="caption" style="z-index:1 !important;">{{ caption }}</div>' +
        '<img class="icon" media="{{icon}}">' +
        '<div class="progress-bar {{class}}" style="background-color: rgba({{colour}}, 1)" ng-style="vertical?{height: progressPercent+\'%\'}:{width: progressPercent+\'%\'}"></div>' +
        "</div>" +
        "</div>",
      link: directiveLink
    };

    return directive;

    function directiveLink($scope, $element, $attrs) {
      if (!angular.isDefined($attrs.colour)) {
        $scope.colour = "255,255,255";
      } else if ($attrs.colour.indexOf("#") == 0) {
        var hex = $attrs.colour;
        $scope.colour = (hex = hex.replace("#", ""))
          .match(new RegExp("(.{" + hex.length / 3 + "})", "g"))
          .map(function(l) {
            return parseInt(hex.length % 2 ? l + l : l, 16);
          })
          .join(",");
      } else {
        $scope.colour = $attrs.colour;
      }
      $scope.$watch("progress", function() {
        // make at least 5% othewise looks daft
        $scope.progressPercent = $scope.progress / $scope.target * 100;

        $scope.progressPercent =
          $scope.progressPercent < 10
            ? 10
            : $scope.progressPercent >= 100
              ? 0
              : $scope.progressPercent;
        $scope.value = $scope.target - $scope.progress;
        $scope.class =
          $scope.progressPercent > 80
            ? "animated infinite " + ($scope.animationHigh || "flash")
            : "animated infinite " + ($scope.animation || "slowFlash");
      });
    }
  }
})();
