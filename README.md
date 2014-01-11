# HTMLShots
## yet another phantom.js screenshots app

**HTMLShots** is a simple **phantom.js** app that creates screenshots from *HTML* files.
Unlike other similar screenshot solutions, **HTMLShots** makes use of the `WebServer` module
so there is no need to spawn one process for each screenshots request.

### requirements

* PhantomJS >= 1.6.0
* ttf-mscorefonts-installer (optional, only if you want Windows fonts)

### install

#### package

We maintain packages for **Ubuntu 12.04 LTS (precise)** in our PPA:

    $ sudo apt-get install -y python-software-properties
    $ sudo add-apt-repository ppa:templateria/htmlshots
    $ sudo apt-get update
    $ sudo apt-get install htmlshots

**Note:** Ubuntu 12.04 LTS (precise) ships PhantomJS 1.4.0, so our PPA repository provides an updated version (1.6.0),
backported from Ubuntu 12.10 (quantal).

By default the **HTMLShots** service is disabled. To enable it, open */etc/default/htmlshots* and set ENABLED=1, then:

    $ sudo start htmlshots

*Note:* **HTMLShots** supports running multiple instances (processes) with the *INSTANCES* parameter in */etc/default/htmlshots*.
This is particularly useful if you are building a service on top of **HTMLShots** and wants to take advantage of running multiple
processes.

If you want to build the package by yourself:

    $ git clone https://github.com/templateria/htmlshots
    $ cd htmlshots
    $ dpkg-buildpackage

#### git

When installing directly from *git*, first make sure you have installed PhantomJS 1.6.0, then:

    $ git clone https://github.com/templateria/htmlshots

To run HTMLShots on port 3000 (default):

    $ cd htmlshots
    $ phantomjs --config=conf/htmlshots.json htmlshots.js

If you want **HTMLShots** to listen in a different port, pass an additional parameter:

    $ phantomjs --config=conf/htmlshots.json htmlshots.js 8080

### how to use

Note: All screenshots are PNG images returned as base64-encoded strings.

**HTMLShots** is not supposed to be a REST API, just a simple way to retrieve screenshots from HTML files.

Currently, the following methods are supported:

#### PUT

Send a PUT request with the HTML contents in the request body. This example uses cURL's *-T (upload file)* parameter
to simplify things:

    $ curl -T index.html http://localhost:3000/ | base64 -d > screenshot.png

#### POST

Send a POST request with the HTML contents URL-encoded in the *html* parameter.

    $ curl -X POST -d html=contents http://localhost:3000/ | base64 -d > screenshot.png

TODO: Send a POST request with the URL for the desired page in the *url* parameter.

    $ curl http://localhost:3000/?url=http://www.google.com/ | base64 -d > screenshot.png
