(function() {
	'use strict';

	angular.module('serviceWindow').directive('reloadTheme', cashlessTransferValue);
	cashlessTransferValue.$inject = ['hammerService'];
	function cashlessTransferValue(hammerService) {
		var directive = {
			restrict: 'A',
			link: directiveLink
		};

		return directive;

		function directiveLink($scope, $element, $attrs) {
			hammerService.addTap($element, function() {
				var themeName = $attrs.reloadTheme; // || 'style.min.css';
				var cssId = 'themeCss_' + $attrs.reloadTheme;
				//if (!document.getElementById(cssId)) {
				var head = document.getElementsByTagName('head')[0];
				var link = document.createElement('link');
				link.id = cssId;
				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.href = 'theme/css/' + themeName + '.css';
				link.media = 'all';
				head.appendChild(link);
				//}
			});
		}
	}
})();
