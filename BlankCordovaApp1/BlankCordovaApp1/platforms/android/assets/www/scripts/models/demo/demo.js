(function () {
    'use strict';
    var controllerId = 'demo';
    angular.module('app').controller(controllerId, ['common', '$scope', '$timeout', 'logger', dashboard]);

    function dashboard(common, $scope, $timeout, logger) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'Demo';
        
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { 
                    common.updatePageTitle(vm.title)
                });
        }



    }
})();