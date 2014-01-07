mercurius
=========

_An angular notification module_

First things first: checkout the demo at http://anzol.biz/mercurius.

So, the history so far: I was looking for a tool to show notifications in an app I am writing using angular (and bootstrap). Essentially, a way to show bootstrap alerts as fixed elements centered top and bottom and in the page corners.

I found bootstrap-growl (https://github.com/ifightcrime/bootstrap-growl), but I was looking for something more angular-ish. Then I found angular-growl (https://github.com/marcorinck/angular-growl) and angular-notify (https://github.com/cgross/angular-notify).

They both seem nice, but not exactly what I was looking for (things hardly are, anyway).

I decided to write my own directive. I soon realized there would be a service to handle things and that everything would fit quite nicely in a module.

Right now it is good enough for myself. It has a very simple api and should be easy to use and understand. At the end it was mostly an oportunity to learn a lot more about directives, modules, provider and a few other angular crazy interesting stuff and way to achieve things. =)

## How to Use It

You'll will have to link the css file and the js file (that is the module itself):

    <link
        href="js/modules/mercurius/mercurius.css"
        rel="stylesheet"
        >

    <script
        src="js/modules/mercurius/mercurius.js"
        >
    </script>

Then you'll inject th mercurius service wherever you need it, like in the provided demo:

```javascript
.controller('demo', function demoController($scope, random, mercurius) {
```

And, finally, use it!:

```javascript
mercurius('Greendale Community College rules!', {
    dismissable: true,
    location: 'topMiddle',
    timeout: 4000,
    type: 'warning',
    width: 'auto'
});
```

The above example uses the default values for the configuration object.

This project was a great oportunity to learn and also give back to the community. I hope someone else finds it useful in the long run. Most feedback is welcome! =D

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
