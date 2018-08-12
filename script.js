class Component
{
    notify() {
        this.callback();
    }

    register(callback) {
        this.callback = callback;
    }

    render() {}
}

class Renderer
{
    constructor(component, destination) {
        this.render = component.render.bind(component);
        this.destination = destination;

        component.register(() => {
            return this.listen();
        });

        this.listen();
    }

    listen () {
        this.destination.innerHTML = '';
        this.destination.appendChild(this.render());
    }
}

class stopWatch extends Component
{
    constructor() {
        super();
    }

    render() {
        $(function () {
            $('.stopwatch').each(function () {
        
                var element = $(this);
                var running = element.data('autostart');
                var hoursElement = element.find('.hours');
                var minutesElement = element.find('.minutes');
                var secondsElement = element.find('.seconds');
                var millisecondsElement = element.find('.milliseconds');
                var toggleElement = element.find('.toggle');
                var resetElement = element.find('.reset');
                var pauseText = toggleElement.data('pausetext');
                var resumeText = toggleElement.data('resumetext');
                var startText = toggleElement.text();
                var hours, minutes, seconds, milliseconds, timer;
        
                function prependZero(time, length) {
                    time = '' + (time | 0);
                    while (time.length < length) time = '0' + time;
                    return time;
                }
        
                function setStopwatch(hours, minutes, seconds, milliseconds) {
                    hoursElement.text(prependZero(hours, 2));
                    minutesElement.text(prependZero(minutes, 2));
                    secondsElement.text(prependZero(seconds, 2));
                    millisecondsElement.text(prependZero(milliseconds, 3));
                }
        
                function runTimer() {          
                    var startTime = Date.now();
                    var prevHours = hours;
                    var prevMinutes = minutes;
                    var prevSeconds = seconds;
                    var prevMilliseconds = milliseconds;
        
                    timer = setInterval(function () {
                        var timeElapsed = Date.now() - startTime;
        
                        hours = (timeElapsed / 3600000) + prevHours;
                        minutes = ((timeElapsed / 60000) + prevMinutes) % 60;
                        seconds = ((timeElapsed / 1000) + prevSeconds) % 60;
                        milliseconds = (timeElapsed + prevMilliseconds) % 1000;
        
                        setStopwatch(hours, minutes, seconds, milliseconds);
                    }, 25);
                }
                function run() {
                    running = true;
                    runTimer();
                    toggleElement.text(pauseText);
                }
        
                function pause() {
                    running = false;
                    clearTimeout(timer);
                    toggleElement.text(resumeText);
                }
        
                function reset() {
                    running = false;
                    pause();
                    hours = minutes = seconds = milliseconds = 0;
                    setStopwatch(hours, minutes, seconds, milliseconds);
                    toggleElement.text(startText);
                }
                toggleElement.on('click', function () {
                    (running) ? pause() : run();
                });
        
                resetElement.on('click', function () {
                    reset();
                });
        
                reset();
                if(running) run();
            });
        });
    }
}