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
            notificationLocations.topLeft.x = 'left';
            notificationLocations.topLeft.y = 'top';
            notificationLocations.topMiddle.x = 'middle';
            notificationLocations.topMiddle.y = 'top';
            notificationLocations.topRight.x = 'right';
            notificationLocations.topRight.y = 'top';
            notificationLocations.bottomLeft.x = 'left';
            notificationLocations.bottomLeft.y = 'bottom';
            notificationLocations.bottomMiddle.x = 'middle';
            notificationLocations.bottomMiddle.y = 'bottom';
            notificationLocations.bottomRight.x = 'right';
            notificationLocations.bottomRight.y = 'bottom';
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
                                return {
                                    content: function content(value) {
                                        if (angular.isUndefined(value)) {
                                            return this.content;
                                        }
                                        if (angular.isString(value)) {
                                            this.content = value;
                                        } else {
                                            throw 'Invalid content!';
                                        }
                                    }.bind(notification),
                                    remove: notification.remove.bind(notification),
                                    type: function type(value) {
                                        if (angular.isUndefined(value)) {
                                            return this.type;
                                        }
                                        this.type = (notificationTypes.indexOf(value) !== -1) ? value : notificationConfiguration.type;
                                    }.bind(notification)
                                };
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
    .directive('stNotifierLoader', [
        '$compile',
        function stNotifierLoader(
            $compile
        ) {
            'use strict';
            return {
                restrict: 'A',
                scope: {},
                link: function link(scope, element) {
                    // function link(scope, element, attributes)
                    element.append($compile('<div data-st-notifier></div>')(scope));
                }
            };
        }
    ])
    .directive('stNotifier', [
        '$rootScope',
        '$timeout',
        '$window',
        'notifier',
        function stNotifierDirective(
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
                    $rootScope.$on('notificationHeightChange', function $on(event, message) {
                        recalculateVerticalDistance(message);
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
        '$timeout',
        '$window',
        'notifier',
        function stNotificationDirective(
            $timeout,
            $window,
            notifier
        ) {
            'use strict';
            var unwatcher,
                calculateVerticalDistance = function calculateVerticalDistance(location, position) {
                    var verticalDistance = notifier.configuration.margin;
                    notifier.locations[location].forEach(function forEach(notification, index) {
                        // forEach(value, index, array)
                        if (index < position) {
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
                restrict: 'A',
                scope: {
                    notification: '='
                },
                link: function link(scope, element) {
                    // function link(scope, element, attributes)
                    var x = notifier.locations[scope.notification.location].x,
                        y = notifier.locations[scope.notification.location].y,
                        index = notifier.locations[scope.notification.location].indexOf(scope.notification);
                    // set position
                    if (x === 'middle') {
                        // centre
                        if (scope.notification.width !== 'auto') {
                            element.css('left', calculateLeftForCentre(scope.notification.width) + 'px');
                        } else {
                            unwatcher = scope.$watch(function watchExpression() {
                                return element.css('width');
                            }, function listener(width) {
                                // function listener(oldValue, newValue, scope)
                                element.css('left', calculateLeftForCentre(parseInt(width, 10)) + 'px');
                                unwatcher();
                            });
                        }
                        angular.element($window).on('resize', function onResize() {
                            element.css('left', calculateLeftForCentre(parseInt(element.css('width'), 10)) + 'px');
                        });
                    }
                    element.css(x, notifier.configuration.margin + 'px');
                    element.css(y, '-9999px');
                    element.css('z-index', 2000);
                    // set width
                    if (scope.notification.width !== 'auto') {
                        element.css('width', scope.notification.width + 'px');
                    } else {
                        unwatcher = scope.$watch(function watchExpression() {
                            return element.css('width');
                        }, function listener(width) {
                            // function listener(oldValue, newValue, scope)
                            element.css('width', width + 'px');
                            unwatcher();
                        });
                    }
                    // set max-width
                    element.css('max-width', calculateMaxWidth() + 'px');
                    angular.element($window).on('resize', function onResize() {
                        element.css('max-width', calculateMaxWidth() + 'px');
                    });
                    // adjust
                    $timeout(function $timeout() {
                        element.css(y, calculateVerticalDistance(scope.notification.location, index) + 'px');
                    });
                    scope.notification.element = element;
                }
            };
        }
    ]);
