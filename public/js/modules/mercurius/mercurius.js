/*jslint node: true */
angular
    .module('mercurius', [])
    .provider('mercurius', [
        function mercuriusProvider() {
            'use strict';
            var notification = {
                    defaultConfiguration: {
                        dismissable: true,
                        location: 'topMiddle',
                        timeout: 4000,
                        type: 'warning',
                        width: 'auto'
                    },
                    possibleLocations: [
                        'topLeft',
                        'topMiddle',
                        'topRight',
                        'bottomLeft',
                        'bottomMiddle',
                        'bottomRight',
                    ],
                    possibleTypes: [
                        'danger',
                        'info',
                        'success',
                        'warning'
                    ]
                },
                notifierConfiguration = {
                    margin: 20,
                    templateUrl: 'js/modules/mercurius/mercurius.html'
                };
            return {
                $get: function $get() {
                    'use strict';
                    var index,
                        length,
                        notifier = function notifier(content, configuration) {
                            configuration = configuration || {};
                            configuration.content = content;
                            if (configuration.dismissable !== false && configuration.dismissable !== true) {
                                configuration.dismissable = notification.defaultConfiguration.dismissable;
                            }
                            if (notification.possibleLocations.indexOf(configuration.location) === -1) {
                                configuration.location = notification.defaultConfiguration.location;
                            }
                            if (configuration.timeout !== null && angular.isNumber(configuration.timeout)) {
                                configuration.timeout = notification.defaultConfiguration.timeout;
                            }
                            if (notification.possibleTypes.indexOf(configuration.type) === -1) {
                                configuration.type = notification.defaultConfiguration.type;
                            }
                            if (configuration.width !== 'auto' && angular.isNumber(configuration.width)) {
                                configuration.timeout = notification.defaultConfiguration.timeout;
                            }
                            notifier.locations[configuration.location].push(configuration);
                            return function close() {
                                var indexOf = notifier.locations[configuration.location].indexOf(configuration);
                                if (indexOf !== -1) {
                                    notifier.locations[configuration.location].splice(indexOf, 1);
                                }
                            };
                        };
                    notifier.locations = {};
                    for (index = 0, length = notification.possibleLocations.length; index < length; index += 1) {
                        notifier.locations[notification.possibleLocations[index]] = [];
                    }
                    notifier.configuration = notifierConfiguration;
                    return notifier;
                },
                configuration: {
                    notification: notification.defaultConfiguration,
                    notifier: notifierConfiguration
                }
            };
        }
    ])
    .directive('mercurius', [
        '$timeout',
        '$window',
        'mercurius',
        function mercuriusDirective(
            $timeout,
            $window,
            mercurius
        ) {
            'use strict';
            var recalculateVerticalDistance = function recalculateVerticalDistance(location) {
                var recalculateVerticalDistanceForLocation = function recalculateVerticalDistanceForLocation(location) {
                        mercurius.locations[location].forEach(function forEach(notification, outerIndex, notifications) {
                            var verticalDistance = mercurius.configuration.margin,
                                animator = {};
                            notifications.forEach(function forEach(notification, innerIndex, notifications) {
                                if (innerIndex < outerIndex) {
                                    verticalDistance += parseInt(notification.element.css('height'), 10);
                                    verticalDistance += mercurius.configuration.margin;
                                }
                            });
                            animator[(location.indexOf('bottom') === 0) ? 'bottom' : 'top'] = verticalDistance + 'px';
                            $timeout(function $timeout() {
                                notification.element.animate(animator);
                            }, 300);
                        });
                    },
                    eachLocation;
                if (location) {
                    recalculateVerticalDistanceForLocation(location);
                } else {
                    for (eachLocation in mercurius.locations) {
                        if (mercurius.locations.hasOwnProperty(eachLocation)) {
                            recalculateVerticalDistanceForLocation(eachLocation);
                        }
                    }
                }
            };
            return {
                restrict: 'AE',
                link: function link(scope, element, attributes) {
                    scope.locations = mercurius.locations;
                    scope.recalculateVerticalDistance = recalculateVerticalDistance;
                    angular.element($window).on('resize', function onResize() {
                        recalculateVerticalDistance();
                    });
                },
                templateUrl: mercurius.configuration.templateUrl
            };
        }
    ])
    .directive('mercuriusNotification', [
        '$timeout',
        '$window',
        'mercurius',
        function mercuriusNotificationDirective(
            $timeout,
            $window,
            mercurius
        ) {
            'use strict';
            var calculateVerticalDistance = function calculateVerticalDistance(location) {
                    var verticalDistance = mercurius.configuration.margin;
                    mercurius.locations[location].forEach(function forEach(notification, index, notifications) {
                        if (notification.element) {
                            verticalDistance += parseInt(notification.element.css('height'), 10);
                            verticalDistance += mercurius.configuration.margin;
                        }
                    });
                    return verticalDistance;
                },
                calculateMaxWidth = function calculateMaxWidth() {

                    var maxWidth = 0;

                    maxWidth -= mercurius.configuration.margin * 2;
                    maxWidth += parseInt(angular.element('body').css('width'), 10);
                    return maxWidth;
                },
                calculateLeftForCentre = function calculateLeftForCentre(width) {

                    var leftForCentre = 0;

                    leftForCentre = parseInt(angular.element('body').css('width'), 10);
                    leftForCentre /= 2;
                    leftForCentre -= width / 2;
                    return leftForCentre;
                };
            return {
                link: function link(scope, element, attributes) {
                    var verticalDistance = calculateVerticalDistance(scope.location);
                    scope.close = function close(index) {
                        scope.notifications.splice(index, 1);
                        scope.recalculateVerticalDistance(scope.location);
                    };
                    if (angular.isNumber(scope.notification.timeout)) {
                        $timeout(function $timeout() {
                            scope.close(scope.$index);
                        }, scope.notification.timeout);
                    }
                    angular.element($window).on('resize', function onResize() {
                        element.css('max-width', calculateMaxWidth() + 'px');
                    });
                    element.css('max-width', calculateMaxWidth() + 'px');
                    if (scope.notification.width !== 'auto') {
                        element.css('width', scope.notification.width + 'px');
                    } else {
                        $timeout(function $timeout() {
                            element.css('width', element.css('width'));
                        });
                    }
                    switch (scope.location) {
                    case 'topLeft':
                        element.css('left', mercurius.configuration.margin + 'px');
                        element.css('top', verticalDistance + 'px');
                        element.css('z-index', 2000);
                        break;
                    case 'topMiddle':
                        element.css('top', verticalDistance + 'px');
                        element.css('z-index', 2000);
                        $timeout(function $timeout() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        angular.element($window).on('resize', function onResize() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        break;
                    case 'topRight':
                        element.css('right', mercurius.configuration.margin + 'px');
                        element.css('top', verticalDistance + 'px');
                        element.css('z-index', 2000);
                        break;
                    case 'bottomLeft':
                        element.css('bottom', verticalDistance + 'px');
                        element.css('left', mercurius.configuration.margin + 'px');
                        element.css('z-index', 2000);
                        break;
                    case 'bottomMiddle':
                        element.css('bottom', verticalDistance + 'px');
                        element.css('z-index', 2000);
                        $timeout(function $timeout() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        angular.element($window).on('resize', function onResize() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        break;
                    case 'bottomRight':
                        element.css('bottom', verticalDistance + 'px');
                        element.css('right', mercurius.configuration.margin + 'px');
                        element.css('z-index', 2000);
                        break;
                    }
                    scope.notification.element = element;
                }
            };
        }
    ]);
