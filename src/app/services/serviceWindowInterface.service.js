(function() {
  "use strict";

  angular
    .module("serviceWindow")
    .factory("serviceWindowInterface", serviceWindowInterface);

  function serviceWindowInterface() {
    console.log("serviceWindowInterface defined");
    var api = {};

    api.onLayoutChange = function(layoutPosition) {
      console.log(
        "serviceWindowInterface:onLayoutChange() called with ",
        layoutPosition
      );
      var bottomMode = "MODE:5\r\nLINE:6\r\n",
        sidebarMode = "MODE:7\r\nLINE:6\r\n",
        param = layoutPosition == "bottom" ? bottomMode : sidebarMode;

      console.log("serviceWindowInterface seeting mode to", param);

      document.getElementsByTagName(
        "body"
      )[0].className = layoutPosition.concat(
        " ",
        param.substr(0, 6).replace(":", "-")
      );

      console.log("sending to socket");
      sendViaSocket(param);
      console.log("complete");
    };
    return api;

    function sendViaSocket(param) {
      //var socket = new WebSocket('ws://localhost:7682/gw', ['wsplugin-gw']); // old
      var socket = new WebSocket("ws://localhost:7680/service_window", [
        "ServiceWindow-content"
      ]);

      socket.onopen = function() {
        console.log("[serviceWindowInterface] - Socket open");
        socket.send(param);
        socket.close();
      };

      socket.onmessage = function(event) {
        console.log(
          "[serviceWindowInterface] - Received from socket",
          event.data
        );
      };

      socket.onerror = function(event) {
        console.error("[serviceWindowInterface] - Socket error", event);
      };

      socket.onclose = function() {
        console.log("[serviceWindowInterface] - Socket closed");
      };
    }
  }
})();
