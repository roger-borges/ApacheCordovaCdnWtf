(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', '$locationProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, $locationProvider, routes) {
        $locationProvider.html5Mode(true);
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
            if (r.subRoutes) {
                r.subRoutes.forEach(function (sr) {
                    $routeProvider.when(sr.url, sr.config);
                })
            }
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                name: 'dashboard',
                subRoutes: [],
                config: {
                    templateUrl: 'app/models/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/demo/',
                name: 'demo',
                subRoutes: [],
                config: {
                    templateUrl: 'app/models/demo/demo.html',
                    title: 'demo',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-coffee"></i> Demo'
                    }
                }
            }
        ];
    }
})();