  import { each, find, map } from 'underscore';
  (function() {
  "use strict";

  angular
    .module("serviceWindow")
    .factory("navigationService", navigationService);

  navigationService.$inject = [
    "$timeout",
    "serviceWindowInterface",
    "messageViewService"
  ];

  function navigationService(
    $timeout,
    serviceWindowInterface,
    messageViewService
  ) {
    var api = {},
      views = [],
      history = [],
      linkEnabled = true,
      activeScreen = null,
      activeView = null,
      historyLength = null;

    // this is a screen object which is active
    Object.defineProperty(api, "activeView", {
      get: function() {
        return activeView;
      },
      set: function(view) {
        console.log("set activeView called");
        activeView = view;

        each(views, function(v) {
          v.reset();
        });
        if (!activeView) {
          api.clearHistory();
        }
        if (null !== activeView) {
          // let's handle only if left view changes
          serviceWindowInterface.onLayoutChange("left");
        } else if (null == activeView) {
          // let's handle only if left view changes
          serviceWindowInterface.onLayoutChange("bottom");
        }
      }
    });

    // this is a view object which is active
    Object.defineProperty(api, "activeScreen", {
      get: function() {
        return activeScreen;
      },
      set: function(name) {
        var screen = null;
        each(views, function(view) {
          if (!screen) {
            screen = find(view.screens, { name: name });
            if (screen) {
              api.activeView = view;
            }
          }
        });
        activeScreen = screen;
        if (activeScreen) {
          if (!history.length) {
            history.push(activeScreen);
          }

          if (
            history.length &&
            history[history.length - 1].name !== activeScreen.name
          ) {
            history.push(activeScreen);
          }

          historyLength = history.length;
        } else {
          api.activeView = null;
          api.clearHistory();
        }

        console.log("navigationService:history", history);
      }
    });

    api.isActiveView = function(name) {
      return api.activeView ? api.activeView.name == name : false;
    };

    api.isActiveScreen = function(name) {
      return api.activeScreen ? api.activeScreen.name == name : false;
    };

    // screen history
    api.historyLength = function() {
      return historyLength || 0;
    };

    // screen history
    api.clearHistory = function() {
      history = [];
      historyLength = 0;
    };

    api.registerView = function(view) {
      views.push(view);
    };
    api.isViewExist = function(view) {
      var exist = find(views, { position: "bottom" });
      if (!exist) {
        exist = find(views, { name: view.name });
      }

      return exist;
    };

    api.navigateScreen = function(linkTo, setMsgObj) {
      console.log("linkTo", linkTo);
      if (api.isLinkEnabled()) {
        api.enbledLink(false);
        if (linkTo && linkTo !== "") {
          if (
            find([].concat.apply([], map(views, "screens")), {
              name: linkTo
            })
          ) {
            api.activeScreen = linkTo;
          } else {
            messageViewService.set(
              "Page linked to".concat(
                ' "',
                linkTo,
                '" not registered with the view'
              )
            );
            setMsgObj = null;
          }
        } else {
          api.activeScreen = null;
          api.activeView = null;
        }

        if (setMsgObj) setMsgObj();

        api.enbledLink(true, 100);
      }
    };

    api.isLinkEnabled = function() {
      return linkEnabled;
    };

    api.enbledLink = function(flag, timeout) {
      $timeout(function() {
        linkEnabled = flag;
      }, timeout ? Number(timeout) || 100 : 0);
    };

    api.navigateBack = function(setMsgObj) {
      if (history.length == 1) {
        return;
      }

      if (history.length > 1) {
        historyPop();
      }
      //check the length again
      if (history.length) {
        var prevScreen = historyPop();

        if (prevScreen.name) {
          api.navigateScreen(prevScreen.name, setMsgObj);
        }
      }
    };

    api.navigateStart = function(startScreen, setMsgObj) {
      api.clearHistory();
      api.navigateScreen(startScreen, setMsgObj);
    };

    function historyPop() {
      var prevScreen = history.pop();

      historyLength = history.lengh;

      return prevScreen;
    }

    return api;
  }
})();
