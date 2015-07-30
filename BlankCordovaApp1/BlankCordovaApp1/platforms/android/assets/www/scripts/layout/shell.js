(function () { 
    'use strict';
    
    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common', 'config', shell]);

    function shell($rootScope, common, config) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = false;

        activate();

        function activate() {
            //logSuccess('Hot Towel Angular loaded!', null, true);
            common.activateController([], controllerId);
        }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { /*logSuccess("$routeChangeStart!")*/ }
        );
        
        $rootScope.$on(events.controllerActivateSuccess,
            function (data) { /*logSuccess("controllerActivateSuccess!")*/ }
        );
    };
})();