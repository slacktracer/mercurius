angular
    .module('demo', [
        'notifier'
    ])
    .config([
        'notifierProvider',
        function config(notifierProvider) {
            'use strict';
            // these are the options configurable in the provider (and their default values)
            notifierProvider.notifierConfiguration.animationTime = 400;
            notifierProvider.notifierConfiguration.margin = 20;
            notifierProvider.notifierConfiguration.templateUrl = 'js/modules/notifier/notifier.html';
        }
    ])
    .controller('demo', [
        '$scope',
        'notifier',
        function demoController(
            $scope,
            notifier
        ) {
            'use strict';
            $scope.samples = [
                '<strong>Suspendisse</strong> accumsan placerat diam, vel.',
                '<strong>Aliquam eu ultricies libero</strong>, vel viverra mauris. Pellentesque suscipit, elit a volutpat cursus, lacus sapien.',
                '<strong>Sed lobortis mauris ante.</strong> Etiam urna turpis, gravida at convallis at, accumsan non augue. Pellentesque.',
                '<strong>Integer vitae mi aliquet</strong>, condimentum ligula sit amet, viverra eros. Mauris condimentum vulputate enim, ut tincidunt turpis dapibus sed. Duis.',
                '<strong>Morbi a quam ligula.</strong> Suspendisse potenti. Suspendisse convallis tempor tempor. Nam consequat gravida mauris in facilisis. Ut mauris purus, egestas sed sem vel, ullamcorper bibendum.'
            ];
            $scope.notification = {
                content: '',
                dismissable: true,
                location: 'topMiddle',
                timeout: '8000',
                type: 'warning',
                width: 'auto'
            };
            $scope.clearContent = function clearContent() {
                $scope.notification.content = '';
            };
            $scope.setContent = function setContent(index) {
                $scope.notification.content = $scope.samples[index];
            };
            $scope.show = function show(notification) {
                notification.timeout = parseInt(notification.timeout, 10) || null;
                notification.width = parseInt(notification.width, 10) || null;
                notifier(notification.content, notification);
            };
        }
    ]);
