/** Directive Name : slide-show
Like Cycle widget, developers can make use of slide-show widget. It will give additional controls to navigate to previous and next slide and removing the inactive child elements from DOM completely.
It accepts following attributes/bindings.
•	captions – caption of the slide (Slideshow header)
•	auto – defines number of seconds for auto slide-show
•	hide-controls when defined, prev and next button controls are hidden
Usage 1:
<slide-show caption="Promotions" auto="5" hide-controls>
    <img class="fadeIn animated" media="slider-jackpot.jpg" />
    <img class="fadeIn animated" media="slider-hot-seat-bronze.jpg" />
    <img class="fadeIn animated" media="slider-hot-seat-silver.jpg" />
</slide-show>

Usage 2:
<slide-show>
    <div style="color:red">
        <div class="slide-show-caption">Hit the Jackpot</div>
        <img class="fadeIn animated" media="slider-jackpot.jpg" />
    </div>
    <div style="color:green">
        <div class="slide-show-caption">Bronze hot seat</div>
        <img class="fadeIn animated" media="slider-hot-seat-bronze.jpg" />
    </div>
    <div style="color:blue">
        <div class="slide-show-caption">Silver hot seat</div>
        <img class="fadeIn animated" media="slider-hot-seat-silver.jpg" />
    </div>
</slide-show>

 */
import angular from 'angular';
(function() {
	'use strict';

	angular.module('widgets').directive('slideShow', slideShow);
	slideShow.$inject = ['$compile'];
	function slideShow($compile) {
		var directive = {
			bindToController: {},
			template: [
				'<div class="slide-show-wrapper">',
				'<div ng-if="$ctrl.caption" class="slide-show-caption">{{$ctrl.caption}}</div>',
				'<div class="slides"></div>',
				'<div ng-if="$ctrl.showControls" class="slide-navigation">',
				'<button touch-callback="$ctrl.prev()" class="prev btn"><span class="font-icon icon-previous"></span></button>',
				'<button touch-callback="$ctrl.next()" class="next btn"><span class="font-icon icon-next"></span></button>',
				'</div>',
				'</div>'
			].join(''),
			transclude: true,
			replace: true,
			restrict: 'E',
			controllerAs: '$ctrl',
			scope: {},
			link: directiveLink,
			controller: directiveController
		};

		return directive;

		function directiveLink($scope, $element, $attrs, ctrls, $transclude) {
			$transclude(function(clone) {
				var slides = $element[0].getElementsByClassName('slides')[0];

				for (var i = 0; i < clone.length; i++) {
					if (clone[i].nodeType === 1) {
						var el = $compile('<slide>'.concat(clone[i].outerHTML, '</slide>'))($scope);
						$(slides).append(el);

						var slideCtrl = el.controller('slide');

						ctrls.registerSlide(slideCtrl);
					}
				}
			});

			$scope.$on('$destroy', ctrls.destroyIntervals);
		}
	}

	directiveController.$inject = ['$attrs', '$interval'];

	function directiveController($attrs, $interval) {
		var activeSlideIndex = -1,
			autoSlideShow;
		this.$onInit = function() {
			this.slides = [];
			this.caption = $attrs.caption;
			this.showControls = !angular.isDefined($attrs.hideControls);

			if (angular.isDefined($attrs.auto)) {
				var duration = (Number($attrs.auto) || (!this.showControls ? 5 : 0)) * 1000;

				if (duration > 0) {
					autoSlideShow = $interval(
						_.bind(function() {
							this.next();
						}, this),
						duration
					);
					console.log('autoSlideShow created');
				}
			}
		};

		this.$postLink = function() {};

		this.$onChanges = function(changes) {};

		this.registerSlide = function(slide) {
			this.slides.push(slide);

			if (slide.isActive) {
				this.setActiveSlide(slide);
			}

			if (activeSlideIndex < 0) {
				this.setActiveSlide(this.slides[0]);
			}
		};

		this.setActiveSlide = function(slide) {
			this.slides.forEach(function(s) {
				s.isActive = false;
			});

			slide.setActive();

			this.slides.forEach(function(s, i) {
				if (s.isActive) {
					activeSlideIndex = i;
				}
			});
		};

		this.next = function() {
			activeSlideIndex++;

			if (activeSlideIndex === this.slides.length) {
				activeSlideIndex = 0;
			}

			this.setActiveSlide(this.slides[activeSlideIndex]);

			console.log('next slide', activeSlideIndex);
		};

		this.prev = function() {
			activeSlideIndex--;
			if (activeSlideIndex === -1) {
				activeSlideIndex = this.slides.length - 1;
			}
			this.setActiveSlide(this.slides[activeSlideIndex]);
		};

		this.destroyIntervals = function() {
			if (autoSlideShow) {
				$interval.cancel(autoSlideShow);
				console.log('autoSlideShow destroyed');
			}
		};
	}
})();
