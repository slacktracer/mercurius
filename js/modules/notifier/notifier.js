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
        '$rootScope',
        '$window',
        'notifier',
        function stNotificationDirective(
            $rootScope,
            $window,
            notifier
        ) {
            'use strict';
            var unwatcher,
                calculateVerticalDistance = function calculateVerticalDistance(location) {
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
                },
                setTop = function setTop(scope, element) {
                    element.css('top', calculateVerticalDistance(scope.notification.location) + 'px');
                },
                setRight = function setRight(element) {
                    element.css('right', notifier.configuration.margin + 'px');
                },
                setBottom = function setBottom(scope, element) {
                    element.css('bottom', calculateVerticalDistance(scope.notification.location) + 'px');
                },
                setLeft = function setLeft(element) {
                    element.css('left', notifier.configuration.margin + 'px');
                },
                setLeftForCentre = function setLeftForCentre(scope, element) {
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
                },
                setWidth = function setWidth(scope, element) {
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
                },
                setMaxWidth = function setMaxWidth(element) {
                    element.css('max-width', calculateMaxWidth() + 'px');
                    angular.element($window).on('resize', function onResize() {
                        element.css('max-width', calculateMaxWidth() + 'px');
                    });
                };
            return {
                scope: {
                    notification: '='
                },
                link: function link(scope, element) {
                    // function link(scope, element, attributes)
                    switch (scope.notification.location) {
                    case 'topLeft':
                        setLeft(element);
                        setTop(scope, element);
                        element.css('z-index', 2000);
                        break;
                    case 'topMiddle':
                        setTop(scope, element);
                        element.css('z-index', 2000);
                        setLeftForCentre(scope, element);
                        break;
                    case 'topRight':
                        setRight(element);
                        setTop(scope, element);
                        element.css('z-index', 2000);
                        break;
                    case 'bottomLeft':
                        setBottom(scope, element);
                        setLeft(element);
                        element.css('z-index', 2000);
                        break;
                    case 'bottomMiddle':
                        setBottom(scope, element);
                        element.css('z-index', 2000);
                        setLeftForCentre(scope, element);
                        break;
                    case 'bottomRight':
                        setBottom(scope, element);
                        setRight(element);
                        element.css('z-index', 2000);
                        break;
                    }
                    setWidth(scope, element);
                    setMaxWidth(element);
                    unwatcher = scope.$watch(function watchExpression() {
                        return element.css('height');
                    }, function listener() {
                        $rootScope.$emit('notificationHeightChange', scope.notification.location);
                        unwatcher();
                    });
                    scope.notification.element = element;
                }
            };
        }
    ]);
