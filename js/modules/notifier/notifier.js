angular
    .module('notifier', [
        'ngAnimate',
        'ngSanitize'
    ])
    .provider('notifier', [
        function notifierProvider() {
            'use strict';
            var notifierConfiguration = {
                    animationTime: 400,
                    hackMode: false,
                    margin: 20,
                    templateUrl: 'js/modules/notifier/notifier.html'
                },
                notificationLocations = {
                    'topLeft': [],
                    'topMiddle': [],
                    'topRight': [],
                    'bottomLeft': [],
                    'bottomMiddle': [],
                    'bottomRight': []
                },
                notificationTypes = [
                    'danger',
                    'info',
                    'success',
                    'warning'
                ],
                notificationConfiguration = {
                    dismissable: true,
                    location: 'topMiddle',
                    timeout: null,
                    type: 'warning',
                    width: 'auto'
                };
            return {
                $get: [
                    '$rootScope',
                    '$timeout',
                    function $get(
                        $rootScope,
                        $timeout
                    ) {
                        var notificationPrototype = {
                                remove: function remove() {
                                    var index = notificationLocations[this.location].indexOf(this);
                                    notificationLocations[this.location].splice(index, 1);
                                    $rootScope.$broadcast('removedNotification', this.location);
                                },
                                setProperties: function setProperties(configuration) {
                                    if (angular.isObject(configuration)) {
                                        this.dismissable = (typeof configuration.dismissable === 'boolean') ? configuration.dismissable : notificationConfiguration.dismissable;
                                        this.location = (notificationLocations.hasOwnProperty(configuration.location)) ? configuration.location : notificationConfiguration.location;
                                        this.timeout = (angular.isNumber(configuration.timeout)) ? configuration.timeout : notificationConfiguration.timeout;
                                        this.type = (notificationTypes.indexOf(configuration.type) !== -1) ? configuration.type : notificationConfiguration.type;
                                        this.width = (angular.isNumber(configuration.width)) ? configuration.width : notificationConfiguration.width;
                                    } else {
                                        this.dismissable = notificationConfiguration.dismissable;
                                        this.location = notificationConfiguration.location;
                                        this.timeout = notificationConfiguration.timeout;
                                        this.type = notificationConfiguration.type;
                                        this.width = notificationConfiguration.width;
                                    }
                                }
                            },
                            notifier = function notifier(content, configuration) {
                                var notification = Object.create(notificationPrototype);
                                notification.content = content;
                                notification.setProperties(configuration);
                                notificationLocations[notification.location].push(notification);
                                if (notification.timeout !== null) {
                                    $timeout(function $timeout() {
                                        notification.remove();
                                    }, notification.timeout);
                                }
                                return notification;
                            };
                        notifier.configuration = notifierConfiguration;
                        notifier.locations = notificationLocations;
                        return notifier;
                    }
                ],
                notifierConfiguration: notifierConfiguration,
                notificationConfiguration: notificationConfiguration
            };
        }
    ])
    .directive('stNotifier', [
        '$rootScope',
        '$timeout',
        '$window',
        'notifier',
        function notifierDirective(
            $rootScope,
            $timeout,
            $window,
            notifier
        ) {
            'use strict';
            var recalculateVerticalDistance = function recalculateVerticalDistance(location) {
                var recalculateVerticalDistanceForLocation = function recalculateVerticalDistanceForLocation(location) {
                        notifier.locations[location].forEach(function forEach(notification, outerIndex, notifications) {
                            var verticalDistance = notifier.configuration.margin,
                                animationTime = notifier.configuration.animationTime,
                                animator = {};
                            notifications.forEach(function forEach(notification, innerIndex) {
                                // forEach(notification, innerIndex, notifications)
                                if (innerIndex < outerIndex) {
                                    verticalDistance += parseInt(notification.element.css('height'), 10);
                                    verticalDistance += notifier.configuration.margin;
                                }
                            });
                            animator[(location.indexOf('bottom') === 0) ? 'bottom' : 'top'] = verticalDistance + 'px';
                            $timeout(function $timeout() {
                                notification.element.animate(animator, animationTime);
                            }, 300);
                        });
                    },
                    eachLocation;
                if (location) {
                    recalculateVerticalDistanceForLocation(location);
                } else {
                    for (eachLocation in notifier.locations) {
                        if (notifier.locations.hasOwnProperty(eachLocation)) {
                            recalculateVerticalDistanceForLocation(eachLocation);
                        }
                    }
                }
            };
            return {
                restrict: 'AE',
                scope: {},
                link: function link(scope) {
                    // function link(scope, element, attributes)
                    scope.locations = notifier.locations;
                    angular.element($window).on('resize', function onResize() {
                        recalculateVerticalDistance();
                    });
                    $rootScope.$on('removedNotification', function $on(event, message) {
                        recalculateVerticalDistance(message);
                    });
                },
                templateUrl: notifier.configuration.templateUrl
            };
        }
    ])
    .directive('stNotification', [
        '$rootScope',
        '$timeout',
        '$window',
        'notifier',
        function notificationDirective(
            $rootScope,
            $timeout,
            $window,
            notifier
        ) {
            'use strict';
            var calculateVerticalDistance = function calculateVerticalDistance(location) {
                    var verticalDistance = notifier.configuration.margin;
                    notifier.locations[location].forEach(function forEach(notification) {
                        // forEach(notification, index, notifications)
                        if (notification.element) {
                            verticalDistance += parseInt(notification.element.css('height'), 10);
                            verticalDistance += notifier.configuration.margin;
                        }
                    });
                    return verticalDistance;
                },
                calculateMaxWidth = function calculateMaxWidth() {
                    var maxWidth = 0;
                    maxWidth -= notifier.configuration.margin * 2;
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
                scope: {
                    notification: '='
                },
                link: function link(scope, element) {
                    // function link(scope, element, attributes)
                    switch (scope.notification.location) {
                    case 'topLeft':
                        element.css('left', notifier.configuration.margin + 'px');
                        element.css('top', calculateVerticalDistance(scope.notification.location) + 'px');
                        element.css('z-index', 2000);
                        break;
                    case 'topMiddle':
                        element.css('top', calculateVerticalDistance(scope.notification.location) + 'px');
                        element.css('z-index', 2000);
                        angular.element($window).on('resize', function onResize() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        $timeout(function $timeout() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        break;
                    case 'topRight':
                        element.css('right', notifier.configuration.margin + 'px');
                        element.css('top', calculateVerticalDistance(scope.notification.location) + 'px');
                        element.css('z-index', 2000);
                        break;
                    case 'bottomLeft':
                        element.css('bottom', calculateVerticalDistance(scope.notification.location) + 'px');
                        element.css('left', notifier.configuration.margin + 'px');
                        element.css('z-index', 2000);
                        break;
                    case 'bottomMiddle':
                        element.css('bottom', calculateVerticalDistance(scope.notification.location) + 'px');
                        element.css('z-index', 2000);
                        angular.element($window).on('resize', function onResize() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        $timeout(function $timeout() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                        break;
                    case 'bottomRight':
                        element.css('bottom', calculateVerticalDistance(scope.notification.location) + 'px');
                        element.css('right', notifier.configuration.margin + 'px');
                        element.css('z-index', 2000);
                        break;
                    }
                    if (scope.notification.width !== 'auto') {
                        element.css('width', scope.notification.width + 'px');
                    } else {
                        $timeout(function $timeout() {
                            element.css('width', element.css('width'));
                        });
                    }
                    element.css('max-width', calculateMaxWidth() + 'px');
                    angular.element($window).on('resize', function onResize() {
                        element.css('max-width', calculateMaxWidth() + 'px');
                    });
                    scope.notification.element = element;
                    // and this is a hack...
                    // if I call notifier() multiple times at once calculateVerticalDistance() doesn't work properly
                    // the element isn't in the DOM yet (I pretty sure this is it...) so it doesn't have its final height
                    if (notifier.configuration.hackMode) {
                        $timeout(function $timeout() {
                            $rootScope.$emit('removedNotification', scope.notification.location);
                        });
                    }
                }
            };
        }
    ]);
