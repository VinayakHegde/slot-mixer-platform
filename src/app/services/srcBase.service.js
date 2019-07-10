(function() {
	'use strict';

	angular.module('serviceWindow').factory('srcBaseService', srcBaseService);

	srcBaseService.$inject = ['ngSrcDirective', '$sce', 'configService'];

	function srcBaseService(ngSrcDirective, $sce, configService) {
		var settings = {
			loadingClass: 'fa fa-spinner',
			errorClass: 'fa fa-exclamation-triangle',
			iframeError: 'Error loading external resource'
		};
		function getTagName($element) {
			return $element[0].tagName.toLowerCase();
		}
		function addSpinner($element) {
			var spinner = document.createElement('span');
			spinner.className = (settings.loadingClass || '').concat(' pt-', getTagName($element), '-loading');

			$element.parent().append(spinner);
			$element.addClass('pt-hide');
		}

		function onLoad($element) {
			var parent = $element.parent()[0];
			if (parent) {
				var spnr = parent.getElementsByClassName('pt-'.concat(getTagName($element), '-loading'))[0];
				if (spnr.remove) {
					spnr.remove();
				} else {
					spnr.style.display = 'none';
				}
			}

			$element.removeClass('pt-hide');
		}

		function onError($element) {
			var parent = $element.parent()[0];
			if (parent) {
				var spnr = $element[0].parentElement.getElementsByClassName('pt-'.concat(getTagName($element), '-loading'))[0];
				spnr.className = (settings.errorClass || '').concat(' pt-', getTagName($element), '-error');
				if (settings.errorMessage) {
					spnr.innerText = errorMessage;
				}
			}
			if ($element[0].remove) {
				$element[0].remove();
			}
		}

		function bindEvents($element) {
			addSpinner($element);
			$element.bind('error', function() {
				onError($element);
			});
			$element.bind('load'.concat(getTagName($element) == 'video' ? 'start' : ''), function() {
				onLoad($element);
			});
		}

		function directive(srcAttr) {
			var ngSrc = ngSrcDirective[0];

			this.priority = ngSrc.priority; // priority level 99
			this.restrict = ngSrc.restrict;

			this.link = function($scope, $element, $attrs, $ctrls) {
				// if necessary, reload the settings object from configService
				/*settings = {
                    loadingClass: configService.get('loading-class'),
                    errorClass: configService.get('loading-error-class'),
                    errorMessage: configService.get('loading-error-message')
                }*/
				//bindEvents($element);

				var resource = $attrs[srcAttr];
				if (resource && resource.length > 0) {
					if (srcAttr == 'media') {
						resource = configService
							.get('path-to-media')
							.replace('~', '')
							.concat(resource);
					}
					$attrs.ngSrc = $sce.trustAsResourceUrl(resource);
					ngSrc.link.apply(ngSrc, arguments);
				}
			};

			return this;
		}

		return {
			directive: directive
		};
	}
})();
