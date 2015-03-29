DuckieDocs

.directive('company', function() {

    return {
        restrict: 'E',
        templateUrl: 'templates/directives/company.html',
        controllerAs: 'vm',
        scope: {
            id: '@'
        },
        link: function($scope, iElement, iAttr) {
            $scope.id = $scope.entity;
            console.log('entity!', $scope);

        },
        controllerAs: 'vm',
        controller: function($scope, $mdDialog) {

            var vm = this;

            if ($scope.id == "") {
                $scope.company = this.company = new Company();
            }

            this.addCompany = function($event) {
                $mdDialog.show({
                    targetEvent: $event,
                    templateUrl: 'templates/directives/addCompanyDialog.html',
                    controller: function($scope, company, companyFields) {
                        $scope.company = company;
                        $scope.companyFields = companyFields;
                    },
                    locals: {
                        company: this.company,
                        companyFields: this.companyFields
                    }
                });
            }


            this.companyFields = [{
                key: 'name',
                type: 'md-input',
                templateOptions: {
                    type: 'text',
                    label: 'Company Name',
                    placeholder: 'ACME B.V.'
                }
            }, {
                key: 'address',
                type: 'md-input',
                templateOptions: {
                    type: 'text',
                    label: 'Address',
                    placeholder: 'Streetname XX'
                }
            }, {
                key: 'country',
                type: 'md-input',
                templateOptions: {
                    type: 'text',
                    label: 'Country',
                    placeholder: 'NomansLand'
                }
            }];


        }
    }

})



.directive('crudRelationEditor', function() {
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