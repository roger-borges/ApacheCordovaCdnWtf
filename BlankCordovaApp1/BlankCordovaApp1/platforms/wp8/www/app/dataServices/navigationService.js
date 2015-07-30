/* courseService: data access and model management layer 
 * relies on Angular injector to provide:
 *     $timeout - Angular equivalent of 'setTimeout'
 *     breeze - the Breeze.Angular service (which is breeze itself)
 *     logger - the application's logging facility
 */
(function () {

    angular.module('app').factory('navigationService', ['$timeout', 'breeze', 'logger', navigationService]);

    function navigationService($timeout, breeze, logger) {

        var serviceName = 'api/Navigation'; // route to the same origin Web Api controller

        // *** Cross origin service example  ***
        // When data server and application server are in different origins
        //var serviceName = 'http://todo.breezejs.com/breeze/todos'; 

        var manager = common.createBreezeManager({
            serviceName: serviceName
        });
        manager.enableSaveQueuing(true);

        var service = {
            getNavigation: getNavigation
        };
        return service;

        function getNavigation() {
            var query = breeze.EntityQuery.from("GetNavigation");


            var promise = manager.executeQuery(query).catch(queryFailed);
            return promise;

            function queryFailed(error) {
                logger.logError(error.message, "Query failed");
                throw error; // so downstream promise users know it failed
            }
        }
    }

})();