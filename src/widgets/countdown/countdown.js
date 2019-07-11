import Register from '../services/registery.service';

class Countdown{
	static get $inject(){
		return ['$timeout'];
	}

	constructor($timeout){
		this.$timeout = $timeout;
		this.timer = null;
		if (this.fromDate) {
			this.startTime = new Date(this.fromDate).getTime();
		}
		this.endTime = new Date(this.targetDate).getTime();

		this.tick(0);

	}

	tick(time) {
		this.timer = this.$timeout(() =>{
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
		}, time);
	};

	$onDestroy() {
		if(this.timer)
			this.$timeout.cancel(this.timer);
	};
}
const countdown = () => {
	var directive = {
		template: () => ['<span>{{$ctrl.timeString}}</span>'].join(''),
		transclude: true,
		restrict: 'EA',
		controllerAs: '$ctrl',
		replace: true,
		scope: true,
		bindToController: {
			fromDate : '@',
			targetDate: '@'
		},
		controller: Countdown
	};

	return directive;
}
Register.directive('countdown', countdown);