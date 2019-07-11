import Register from '../services/registery.service';
const directiveLink = ($interval, $window) => ($scope, $element, $attrs) => {
	$element.addClass('cycle-wrapper');
	var cycleInterval = ($attrs.cycle || 2) * 1000,
		slides = $element.children(),
		slideCount = slides.length,
		cycleCount = 0,
		showPager = angular.isDefined($attrs.showPager),
		pager = null;

	if (showPager) {
		pager = document.createElement('div');
		$element.append(pager);
		pager.classList.add('pager');
		var i = 0;
		for (i = 0; i < slideCount; i++) {
			var page = document.createElement('div');
			pager.appendChild(page);
			page.classList.add('page');
			if (i === 0) {
				page.classList.add('active-page');
			}
		}
	}

	if (slideCount > 1) {
		slides.addClass('cycle-off');
		slides[cycleCount].classList.remove('cycle-off');
		slides[cycleCount].classList.add('cycle-on');

		var cycleThrough = $interval(function() {
			slides.removeClass('cycle-on').addClass('cycle-off');
			cycleCount = cycleCount + 1 >= slideCount ? 0 : cycleCount + 1;
			slides[cycleCount].classList.remove('cycle-off')
			slides[cycleCount].classList.add('cycle-on');

			if (showPager) {
				var pages = pager.children;
				for (let el of pages) {
					el.classList.remove('active-page');
				}
				pages[cycleCount].classList.add('active-page');
			}
		}, cycleInterval);

		$window.onbeforeunload = function() {
			$interval.cancel(cycleThrough);
		};

		$scope.$on('$destroy', function() {
			$interval.cancel(cycleThrough);
		});
	}
}

const cycle = ($interval, $window) => {
	var directive = {
		restrict: 'A',
		link: directiveLink($interval, $window),
		scope: true
	};

	return directive;
}
cycle.$inject = ['$interval', '$window'];

Register.directive('cycle', cycle);