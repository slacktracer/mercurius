An AngularJS Notifier Module
============================

First things first: checkout the demo at http://anzol.biz/mercurius.

This module contains one module(**notifier**) one service (**notifier**) and two directives (**stNotifier** and **stNotification**).
It depends on Angularjs modules **ngAnimate** and **ngSanitize**.

## How to Use It

First reference the stylesheet and the js file (the module itself):

    <link
        href="your/path/to/notifier.css"
        rel="stylesheet"
        >

    <script
        src="your/path/to/notifier.js"
        >
    </script>

Put **notifier** as a dependency in your module and configure the URL to the teplate file (the path to notifier.html):

    angular
        .module('YOUR_MODULE', [
            'notifier'
        ])
        .config(function config(notifierProvider) {
            // this example path represent how I organize my modules...
            notifierProvider.configuration.notifier.templateUrl = 'js/modules/notifier/notifier.html';
        })

Then you'll inject the notifier service wherever you need it, like in the provided demo:

    .controller('demo', [
        '$scope',
        'notifier',
        function demoController(
            $scope,
            notifier
        ) {
            'use strict';

And, finally, use it!:

    // notifier(content, configuration);
    // for example:
    notifier('Greendale Community College rules!', {
        dismissable: true,
        location: 'topMiddle',
        timeout: null,
        type: 'warning',
        width: 'auto'
    });

The above example uses the default values for the configuration object. Of course, you only have to define the properties that differ from the defaults.

    notifier('Don\'t get cocky, <em>kid</em>! =P', {
        location: 'bottomMiddle'
        width: 200
    });

    notifier('I have a bad feeling about this...', {
        type: 'info'
        width: 800
    });

    notifier('<strong>Now you listen to me, lad!</strong> I ain\'t gonna tolerate this anymore!, {
        type: 'danger',
        dismissable: false,
        timeout: 10000
    });

The **notifier** function return a **notification** object with. among other properties, a **remove** method, so you can remove a notification programmatically at any time.

    var n = notifier('Frankly, my dear, I don\'t give a damn...');
    setTimeout(function () {
        n.remove();
    }, 10000);

Most feedback is welcome! =D


## License

The MIT License (MIT)

Copyright (c) 2014 Thiago Figueiredo

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
