function timer(duration, interval, onEnd, onInterval) {
    var steps = (duration / 100) * (interval / 10),
        speed = duration / steps,
        step = 0,
        start = new Date().getTime(),
        elapsed = 0,
        obj = {
            timeout: null,
            cancel: function() {
                console.log('canceling');
                clearTimeout(this.timeout);
            }
        };


    function run() {
        if(step++ == steps) {
            onEnd(steps, step);
        } else {
            if (onInterval instanceof Function) onInterval(steps, step);

            //console.log(new Date().getTime() - start);

            var diff = (new Date().getTime() - start) - (step * speed);
            obj.timeout = setTimeout(run, (speed - diff));
        }
    }

    setTimeout(run, speed);
    return obj;
}
var foo = timer(10000, 100, () => console.log('foo'));
