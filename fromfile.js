var port    = phantom.args[0] ? phantom.args[0] : 3000;
var server  = require('webserver').create();
var page    = require('webpage').create();

/**
 * Waits for maxTimeOut until a certain condition is met.
 * 
 * @param  callback testFx     Callback that returns true/false.
 * @param  callback onReady    Callback to be executed when condition is met.
 * @param  callback onTimeout  Callback to be executed when timeout is reached.
 * @param  int      maxTimeOut Max timeout in milliseconds.
 * 
 * @return void
 */
function waitFor(testFx, onReady, onTimeout, maxTimeOut) {
    var maxTimeOut = maxTimeOut ? maxTimeOut : 3000;
    var start      = new Date().getTime();
    var condition  = false;
    var check      = function () {
        if ((new Date().getTime() - start < maxTimeOut) && !condition ) {
            condition = (typeof(testFx) === "string" ? eval(testFx) : testFx());
        } else {
            if(!condition) {
                typeof(onTimeout) === "string" ? eval(onTimeout) : onTimeout();
                clearInterval(interval);
            } else {
                typeof(onReady) === "string" ? eval(onReady) : onReady();
                clearInterval(interval);
            }
        }
    };
    interval = setInterval(check, 400);
}

/**
 * Checks if all images have been loaded.
 * 
 * @return boolean
 */
function imagesLoaded() {
    return page.evaluate(function() {
        var images     = document.getElementsByTagName('img');
        var isComplete = true;
        for (var i = 0; i < images.length; i++) {
            if (!images[i].complete) {
                isComplete = false;
            }
        }
        return isComplete;
    });
}

var service = server.listen(port, function (request, response) {

    var send = function (httpStatus, message) {
        response.statusCode = httpStatus;
        response.write(typeof(message) == 'object' ? JSON.stringify(message) : message);
        return response.close();
    }

    if (request.method != 'PUT' && request.method != 'POST') {
        return send(415, {error: 'Only PUT and POST are allowed.'});
    }

    if (request.method == 'POST' && typeof(request.post) == 'undefined') {
        return send(400, {error: 'Field "html" is required.'});
    }

    var contents = request.method == 'PUT' ? request.post : request.post.html;

    if (!contents) {
        return send(400, {error: 'Content is empty.'});
    }

    page.viewportSize = { width: 1024, height: 768 };
    page.onLoadFinished = function (status) {
        if (status != 'success') {
            send(500, {error: 'Sorry, something wrong happened.'});
        }
        waitFor(imagesLoaded,
            function () { return send(200, page.renderBase64()); },
            function () { return send(500, {error: 'A timeout has ocurred.'}); },
            10000
        );
    };
    page.content = contents;
});
