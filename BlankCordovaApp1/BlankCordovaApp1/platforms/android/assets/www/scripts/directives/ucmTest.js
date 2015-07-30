(function () {
    'use strict';

    angular.module('app').directive('ucmTest', ['logger', '$compile', function (logger, $compile) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            template: '<span ng-transclude></span>',
            scope: false,
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                
                
            }]
        };
    }]);
})();