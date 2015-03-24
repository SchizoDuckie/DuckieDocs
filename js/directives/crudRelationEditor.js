DuckieDocs.directive('crudRelationEditor', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/crudRelationEditor.html',
        controllerAs: 'editor',
        bindToController: true,
        transclude: true,

        controller: function($rootScope, $scope) {
            var panel = this;

            this.isShowing = false;
            this.isExpanded = false;


        }
    }
});