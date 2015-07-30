/* courseService: data access and model management layer 
 * relies on Angular injector to provide:
 *     $timeout - Angular equivalent of 'setTimeout'
 *     breeze - the Breeze.Angular service (which is breeze itself)
 *     logger - the application's logging facility
 */
(function () {

    angular.module('app').factory('courseService',
    ['$timeout', 'breeze', 'logger', 'common', courseService]);

    function courseService($timeout, breeze, common, logger) {

        var serviceName = 'api/Course'; // route to the same origin Web Api controller

        // *** Cross origin service example  ***
        // When data server and application server are in different origins
        //var serviceName = 'http://todo.breezejs.com/breeze/todos'; 

        var manager = common.createBreezeManager({
            serviceName: serviceName
        });
        manager.enableSaveQueuing(true);

        var service = {
            addPropertyChangeHandler: addPropertyChangeHandler,
            getCourses: getCourses,
            hasChanges: hasChanges,
            removePropertyChangeHandler: removePropertyChangeHandler,
            saveChanges: saveChanges
        };
        return service;

        /*** implementation details ***/

        function addPropertyChangeHandler(handler) {
            // Actually adds any 'entityChanged' event handler
            // call handler when an entity property of any entity changes
            return manager.entityChanged.subscribe(function (changeArgs) {
                var action = changeArgs.entityAction;
                if (action === breeze.EntityAction.PropertyChange) {
                    handler(changeArgs);
                }
            });
        }



        //First 4 parameters are absolutely required
        function getCourses(pageNumber, pageSize, sortDataField, sortOrder, nameContains) {
            var query = breeze.EntityQuery
                .from("GetCourses");

            if (nameContains && nameContains != '') {
                query = query.where('Name', "substringof", nameContains);
            }

            query = query.orderBy(sortDataField + " " + sortOrder)
                .skip(pageNumber*pageSize)
                .take(pageSize)
                .inlineCount(true);
            
            var promise = manager.executeQuery(query).catch(queryFailed);
            return promise;

            function queryFailed(error) {
                throw error; // so downstream promise users know it failed
            }
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function handleSaveValidationError(error) {
            var message = "Not saved due to validation error";
            try { // fish out the first error
                var firstErr = error.entityErrors[0];
                message += ": " + firstErr.errorMessage;
            } catch (e) { logger.log('eat it for now'); logger.log(e) /* eat it for now */ }
            return message;
        }

        function removePropertyChangeHandler(handler) {
            // Actually removes any 'entityChanged' event handler
            return manager.entityChanged.unsubscribe(handler);
        }

        //function reset(callback) {
        //    // Todo: breeze should support commands to the controller
        //    // Simplified: fails silently
        //    $.post(serviceName + '/reset', function () {
        //        logger.success("database reset.");
        //        manager.clear();
        //        if (callback) callback();
        //    });
        //}

        function saveChanges() {
            if (!hasChanges()) {
                return;
            }
            return manager.saveChanges()
                .then(saveSucceeded)
                .catch(saveFailed);

            function saveSucceeded(saveResult) {
                //logger.logSuccess("# of Items saved = " + saveResult.entities.length);
            }

            function saveFailed(error) {

                var reason = error.message;
                var detail = error.detail;

                if (error.entityErrors) {
                    reason = handleSaveValidationError(error);
                } else if (detail && detail.ExceptionType &&
                    detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
                    // Concurrency error 
                    reason =
                        "Another user, perhaps the server, " +
                        "may have deleted one or all of the todos." +
                        " You may have to restart the app.";
                } else {
                    reason = "Failed to save changes: " + reason +
                        " You may have to restart the app.";
                }

                // DEMO ONLY: discard all pending changes
                // Let them see the error for a second before rejecting changes
                $timeout(function () {
                    manager.rejectChanges();
                }, 1000);
                throw error; // so downstream promise users know it failed
            }

        }
    }

})();