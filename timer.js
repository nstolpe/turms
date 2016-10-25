'use strict'

/**
 * Sets up a self-adjusting timer. Based on code from the link below:
 * https://www.sitepoint.com/creating-accurate-timers-in-javascript/
 *
 * @param duration    The full duration of the timer in ms.
 *                    Once reached, `instance.end()` will be called.
 *
 * @param interval    The interval of time in ms after which the timer will.
 *                    adjust itself to better match duration.
 *                    2 seems to be the lower limit, 1 slow down the timer.
 *
 * @param onEnd       The function called when duration has expired.
 *                     Without this the timer won't do anything noticeable.
 *                    Called with `instance` set to `this`.
 *
 * @param onInterval  An optional function to be called on each step of the timer.
 *                    Called with `instance` set to `this`.
 *                    Calling `instance.cancel()` here doesn't work.
 *
 * @TODO Make this use `process.hrtime` instead of `new Date().getTime()` and compare
 *       with epsilon before running next step for accuracy.
 */

const timer = function(duration, interval, onEnd, onInterval) {
    let steps = Math.floor(duration / interval),
		timeout,
		fracStep = duration % interval !== 0 ? duration % interval : null,
		/*
		 * Runs a step in an `instance`.
		 */
		run = function(instance) {
			let diff;

			instance.elapsed = new Date().getTime() - instance.startTime;
			diff = instance.elapsed - (instance.step * interval);

			if(instance.step === instance.steps) {
				if (fracStep) timeout = setTimeout(function() { end(instance); }, (fracStep - diff));
				else end(instance);
	        } else {
				instance.step++
	            if (onInterval) onInterval.call(instance);

	            timeout = setTimeout(function() { run(instance); }, (interval - diff));
	        }
	    },
		/*
		 * Ends the `instance` object passed to it.
		 */
		end = function(instance) {
			timeout = undefined;
			instance.elapsed = new Date().getTime() - instance.startTime;
			instance.complete = true;
			onEnd.call(instance);
		};

	const instance = {
		startTime: null,
		duration: duration,
		elapsed: 0,
		complete: false,
		step: 0,
		steps: steps,
		/*
		 * Called to make a Timer start running. Can be called immediately after
		 * creation, just don't assign to a variable.
		 */
		start() {
			this.startTime = new Date().getTime();
			this.step = 0;
			this.elapsed = 0;
			timeout = setTimeout(function() { run(instance); }, interval);
		},
		/*
		 * Cancels a running timer.
		 */
		cancel() {
			clearTimeout(timeout);
			timeout = undefined;
		}
	};

	return instance;
}

module.exports = timer;
