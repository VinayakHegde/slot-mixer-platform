import Register from '../services/registery.service';

const navigationControl = () => {
  const directive = {
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
    controller: () => {}
  };

  return directive;
}

Register.directive("navigationControl", navigationControl);