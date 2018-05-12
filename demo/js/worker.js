(function() {

    // import mozjpeg script.
    importScripts('cjpeg.min.js');
    importScripts('djpeg.min.js');
    importScripts('jpegtran.min.js');

    // get stdout
    function print(text) {
        postMessage({ 'type': 'stdout', 'data': text });
    }

    /* bind on message event handler */
    onmessage = function(event) {
        var message = event.data;

        if (message.type === "cjpeg" || message.type === "djpeg" || message.type === "jpegtran") {

            var args = message.arguments;

            postMessage({
                'type': 'start',
                'data': JSON.stringify(args)
            });

            print('Start ' + message.type + ', received command: ' + JSON.stringify(args));

            var time = performance.now();

            var result;
            if (message.type === "cjpeg") result = cjpeg(message.file.data, args, print);
            else if (message.type === "djpeg") result = djpeg(message.file.data, args, print);
            else if (message.type === "jpegtran") result = jpegtran(message.file.data, args, print);

            var totalTime = performance.now() - time;

            print('Finished processing (took ' + totalTime.toFixed(0) + 'ms)');

            postMessage({ 'type': 'done', 'data': [result], 'time': totalTime });

        }
    };
    postMessage({ 'type': 'ready' });
})();