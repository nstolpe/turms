'use strict'

const timer = function(duration, interval, onEnd, onInterval) {
    let steps = (duration / 100) * (interval / 10),
        speed = duration / steps,
		timeout,
		run = function(instance) {
	        if(instance.step++ == instance.steps) {
				timeout = undefined;
				instance.complete = true;
	            onEnd.call(instance);
	        } else {
				let diff = (new Date().getTime() - instance.startTime) - (instance.step * speed);

	            if (onInterval) onInterval.call(instance);

				instance.elapsed = new Date().getTime() - instance.startTime;
	            timeout = setTimeout(function() { run(instance); }, (speed - diff));
	        }
	    };

	const instance = {
		startTime: null,
		duration: duration,
		elapsed: 0,
		complete: false,
		step: 0,
		steps: steps,
		start() {
			this.startTime = new Date().getTime();
			this.step = 0;
			this.elapsed = 0;
			timeout = setTimeout(function() { run(instance); }, speed);
		},
		cancel() {
			clearTimeout(timeout);
			timeout = undefined;
		}
	};

	return instance;
}

module.exports = timer;
