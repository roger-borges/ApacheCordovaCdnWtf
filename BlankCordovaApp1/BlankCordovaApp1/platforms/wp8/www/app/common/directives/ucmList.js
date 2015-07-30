(function () {
    'use strict';

    angular.module('app').directive('ucmList', ['logger', function (logger) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                //shared attributes
                listType: '@',//combobox, listbox
                selecteditems: '=',
                disabled: '@',
                getData: '&',
                autocompletedisplaymember: '@',
                autocompletevaluemember: '@'
                
            },
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

                var isDisabled = $scope.disabled
                if (typeof $scope.disabled == 'string') {
                    isDisabled = $scope.$eval($scope.disabled);
                }

                switch ($scope.listType) {
                        case 'combobox':
                            $element.children().empty();
                            var input = angular.element('<div></div>');
                            $element.append(input);
                            $(input).jqxComboBox({
                                placeHolder: "Select a something something",
                                displayMember: $scope.autocompletedisplaymember,
                                valueMember: $scope.autocompletedvaluemember,
                                height: 25,
                                width: 200,
                               
                                theme: 'bootstrap',
                                source: function (query, response) {
                                    //textbox: includes autocompleted
                                    $scope.searchtext = query;
                                    $scope.$apply();//applies current bindings. sometimes the two-way binding doesn't seem to apply quickly enough (like the above line)
                                    var searchParameters = {
                                        pagesize: 10,
                                        pagenum: 0
                                    }
                                    $scope.getData({

                                        searchParameters: searchParameters, callback: function (newData) {
                                            var data = [];
                                            var i;
                                            for (i = 0; i < newData.records.length; i++) {
                                                data.push(newData.records[i][$scope.autocompletedisplaymember]);
                                            }
                                            response(data);
                                        }
                                    });
                                }
                            });
                            $(input).on('select', function () {
                                var val = $(input).val();
                                $scope.selecteditem = val;
                                $scope.$apply();
                            });
                            break;
                        
                    }
            }],
        };
    }]);
})();