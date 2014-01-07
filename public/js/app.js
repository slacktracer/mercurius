angular

    .module('demo', [
        'ngAnimate',
        'ngSanitize',
        'mercurius'
    ])

    .config(function config(mercuriusProvider) {

        mercuriusProvider.configuration.notifier.templateUrl = 'js/modules/mercurius/mercurius.html';

    })

    .factory('random', function randomFactory() {

        'use strict';

        // mdn: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

        return {

            getRandom: function getRandom() {
                // Returns a random number between 0 (inclusive) and 1 (exclusive)
                return Math.random();
            },

            getRandomArbitrary: function getRandomArbitrary(min, max) {
                // Returns a random number between min and max
                return Math.random() * (max - min) + min;
            },

            getRandomInt: function getRandomInt(min, max) {
                // Returns a random integer between min and max
                // Using Math.round() will give you a non-uniform distribution!
                return Math.floor(Math.random() * (max - min + 1) + min);
            },

            getRandomFromArray: function getRandomFromArray(array) {
                // homemade
                return array[this.getRandomInt(0, array.length - 1)];
            }

        };

    })

    .controller('demo', function demoController($scope, random, mercurius) {

        'use strict';

        var loremIpsum = [
                '<strong>Suspendisse</strong> accumsan placerat diam, vel.',
                '<strong>Aliquam eu ultricies libero</strong>, vel viverra mauris. Pellentesque suscipit, elit a volutpat cursus, lacus sapien.',
                '<strong>Sed lobortis mauris ante.</strong> Etiam urna turpis, gravida at convallis at, accumsan non augue. Pellentesque.',
                '<strong>Integer vitae mi aliquet</strong>, condimentum ligula sit amet, viverra eros. Mauris condimentum vulputate enim, ut tincidunt turpis dapibus sed. Duis.',
                '<strong>Morbi a quam ligula.</strong> Suspendisse potenti. Suspendisse convallis tempor tempor. Nam consequat gravida mauris in facilisis. Ut mauris purus, egestas sed sem vel, ullamcorper bibendum.'
            ],

            arrayFromObject = function arrayFromObject(object) {

                var array = [],

                    key;

                for (key in object) {

                    if (object.hasOwnProperty(key)) {

                        if (object[key] === true) {

                            if (key === 'null') {

                                array.push(null);

                            } else if (key === '2000') {

                                array.push(2000);

                            } else if (key === '4000') {

                                array.push(4000);

                            } else if (key === '8000') {

                                array.push(8000);

                            } else if (key === '200') {

                                array.push(200);

                            } else if (key === '400') {

                                array.push(400);

                            } else if (key === '600') {

                                array.push(600);

                            } else {

                                array.push(key);

                            }

                        }

                    }

                }

                return array;

            };

        $scope.configuration = {};

        $scope.configuration.dismissable = true;

        $scope.configuration.location = {
            'topLeft': true,
            'topMiddle': true,
            'topRight': true,
            'bottomLeft': true,
            'bottomMiddle': true,
            'bottomRight': true
        };

        $scope.configuration.timeout = {
            'null': true,
            '2000': true,
            '4000': true,
            '8000': true
        };

        $scope.configuration.type = {
            'danger': true,
            'info': true,
            'success': true,
            'warning': true
        };

        $scope.configuration.width = {
            'auto': true,
            '200': true,
            '400': true,
            '600': true
        };

        $scope.randomNotification = function randomNotification() {

            var content = random.getRandomFromArray(loremIpsum),

                configuration = {
                    dismissable: $scope.configuration.dismissable,
                    location: random.getRandomFromArray(arrayFromObject($scope.configuration.location)),
                    timeout: random.getRandomFromArray(arrayFromObject($scope.configuration.timeout)),
                    type: random.getRandomFromArray(arrayFromObject($scope.configuration.type)),
                    width: random.getRandomFromArray(arrayFromObject($scope.configuration.width))
                };

            mercurius(content, configuration);

        };

    });
