/**
 * Fetches and displays various statistics about current DuckieDocs Setup on About Page
 */
DuckieTV.controller('AboutCtrl', ["$scope", "$rootScope", "$q", "$http", "$filter", "$injector", "SettingsService",
    function($scope, $rootScope, $q, $http, $filter, $injector, SettingsService) {

        $scope.statistics = [];

        getStats = function() {

            // Get Screen Size
            var screenSize = '';
            if (screen.width) {
                width = (screen.width) ? screen.width : '';
                height = (screen.height) ? screen.height : '';
                screenSize += '' + width + " x " + height;
            };

            // Get Database Stats
            countEntity = function(entity) {
                CRUD.EntityManager.getAdapter().db.execute('select count(*) as count from ' + entity).then(function(result) {
                    $scope.statistics.push({
                        name: "DB " + entity,
                        data: result.next().row.count
                    });
                });
            };

            // Get date of last trakt update

            // General misc stats
            $scope.statistics = [{
                name: 'UserAgent',
                data: navigator.userAgent
            }, {
                name: 'Platform',
                data: navigator.platform
            }, {
                name: 'Vendor',
                data: navigator.vendor
            }, {
                name: 'Determined Locale',
                data: SettingsService.get('client.determinedlocale') || 'n/a'
            }, {
                name: 'Active Locale',
                data: SettingsService.get('application.locale')
            }, {
                name: 'Active Language',
                data: SettingsService.get('application.language')
            }, {
                name: 'Screen (width x height)',
                data: screenSize
            }];



            // Local date and time in GMT presentation
            $scope.statistics.unshift({
                name: 'Current Date and Time',
                data: new Date().toGMTString()
            });

            //getSyncTime();
            countEntity('Documents');
            countEntity('Companies');
            countEntity('Tags');
        }
        getStats();
    }
]);