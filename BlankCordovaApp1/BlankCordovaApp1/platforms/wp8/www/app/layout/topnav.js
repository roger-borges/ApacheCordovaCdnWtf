(function () { 
    'use strict';
    
    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$route', 'config', 'routes', 'logger', topnav]);

    function topnav($route, config, routes, logger) {
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.isRedirecting = false;

        activate();

        function activate() { getNavRoutes(); }
        
        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }

        vm.hasSubNavs = function (parentRouteItem) {
            if (parentRouteItem.subRoutes !== null && parentRouteItem.subRoutes.length > 0) {
                return true;
            }
            
            return false;
        };

        vm.getPath = function (routePath) {
            var baseUrl = $('base').first().attr('href');
            baseUrl = baseUrl == '/' ? '' : baseUrl;
            if (baseUrl) {
                routePath = baseUrl + routePath;
            }
            return routePath;
        }

        //the navigate function handles special redirects when routes starting with ./ are clicked
        vm.navigate = function (navRoute) {
            if (navRoute.url && navRoute.url.indexOf('.') == 0) {

                window.location = navRoute.url;
            }
            else {
            }
        }

        vm.isInternalServerRedirect = function (navRoute) {
            if (navRoute.url && navRoute.url.indexOf('.') == 0) {
                return true;
            }
            else {
                return false;
            }
        }
        
        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    };
})();
