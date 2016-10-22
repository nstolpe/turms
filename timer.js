function timer(duration, interval, onEnd, onInterval) {
	function run(instance) {
        if(step++ == steps) {
			timeout = undefined;
			instance.complete = true;
            onEnd(steps, step);
        } else {
			let diff = (new Date().getTime() - startTime) - (step * speed);

            if (onInterval) onInterval(steps, step);

			instance.elapsed = new Date().getTime() - startTime;
            timeout = setTimeout(function() { run(instance); }, (speed - diff));
        }
    }

    var steps = (duration / 100) * (interval / 10),
        speed = duration / steps,
        step = 0,
		timeout,
		startTime,
		instance = {
			duration: duration,
			elapsed: 0,
			complete: false,
			start() {
				startTime = new Date().getTime();
				step = 0;
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
var foo = timer(5000, 100, () => console.log('foo'));
