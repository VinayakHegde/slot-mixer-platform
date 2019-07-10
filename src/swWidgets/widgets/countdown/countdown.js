import angular from 'angular';
(function() {
	'use strict';

	angular.module('swWidgets').directive('countdown', countdown);

	function countdown() {
		var directive = {
			template: getTemplate,
			transclude: true,
			restrict: 'EA',
			controllerAs: '$ctrl',
			replace: true,
			scope: true,
			bindToController: {
				fromDate : '@',
				targetDate: '@'
			},
			link: directiveLink,
			controller: directiveController
		};

		return directive;

		function getTemplate() {
			return ['<span>{{$ctrl.timeString}}</span>'].join('');
		}

		function directiveLink($scope, element, $attrs, ctrls) {}
	}

	directiveController.$inject = ['$attrs', '$timeout', '$interval'];

	function directiveController($attrs, $timeout, $interval) {
		this.$onInit = function() {
			this.tick(0);
			if (this.fromDate) {
				this.startTime = new Date(this.fromDate).getTime();

				//this.fromInterval = $interval(function () { }, 1000)
			}
			this.endTime = new Date(this.targetDate).getTime();
		};

		this.tick = function(time) {
			this.timer = $timeout(
				function () {
					if (this.startTime) this.startTime += 1000;
					var currentTime = this.startTime ? this.startTime : new Date().getTime(); //Date.now();
					var t = this.endTime - currentTime;

					if (t >= 0) {
						var days = Math.floor(t / (1000 * 60 * 60 * 24));
						var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						var mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
						var secs = Math.floor((t % (1000 * 60)) / 1000);
						this.timeString =
							(days ? days + ' Days, ' : '') + (hours ? hours + ':' : '') + mins + ':' + (secs ? secs + '' : '');
					} else {
						this.timeString = 'Expired';
					}

					this.tick(1000);
				}.bind(this),
				time
			);
		};

		this.$onDestroy = function() {
			$timeout.cancel(this.timer);
		};

		this.$onChanges = function(changes) {};
	}
})();
