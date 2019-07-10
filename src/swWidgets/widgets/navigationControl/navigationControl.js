/* DIrective Name: navigation-control
 * When used as a tag directive, it creates navigation control.  However to use this directive, customer start screen must be defined in the settings.
 * 
 * There are four binding elements must be provided to the directive to work.
 * i.	start-caption – start text to be displayed – linked to customer start screen
 * ii.	img-src-back – icon to back button – takes to previous screen
 * iii.	img-src-home – icon for home button – linked to customer start screen
 * iv.	img-src-close -  icon for close button – closes the left side panel
 * 
 * Usage:
 * <navigation-control start-caption="My account"
 *            img-src-back="back.svg"
 *            img-src-home="home.svg"
 *            img-src-close="close.svg">
 * </navigation-control>
 * 
 */

import angular from 'angular';
(function() {
  "use strict";

  angular.module("swWidgets").directive("navigationControl", navigationControl);

  function navigationControl() {
    var directive = {
      bindToController: {
        startCaption: "@",
        imgSrcBack: "@",
        imgSrcHome: "@",
        imgSrcClose: "@",
        homeLink: "@",
        homeIcon: "@"
      },
      transclude: {
        open: "?open"
      },
      template:
        require("./navigationControl.html"),
      restrict: "E",
      controllerAs: "$ctrl",
      controller: directiveController
    };

    return directive;
  }

  function directiveController() {}
})();
