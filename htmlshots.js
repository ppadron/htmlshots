var port    = phantom.args[0] ? phantom.args[0] : 3000;
var server  = require('webserver').create();
var page    = require('webpage').create();

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
        page.evaluate(function() {
            document.body.bgColor = 'white';
        });

        if (typeof(request.post.selector) != 'undefined') {
            var clipRect = page.evaluate(function (selector) {
                return document.querySelector(selector).getBoundingClientRect();
            }, request.post.selector);
            page.clipRect = {
                top: clipRect.top,
                left: clipRect.left,
                width: clipRect.width,
                height: clipRect.height
            };
        }

        return send(200, page.renderBase64());
    };
    page.content = contents;
});
