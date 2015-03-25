DuckieDocs.controller('CompaniesCtrl', ['Companies', '$scope', '$state',
    function(Companies, $scope, $state) {

        this.companies = Companies;
        Companies.map(function(company) {
            CRUD.FindCount('Document', {
                ID_Company: company.ID_Company
            }).then(function(count) {
                company.count = count;
                $scope.$applyAsync();
            })
        });


        this.go = function(company) {
            $state.go('company', {
                id: company.ID_Company
            });

        }
    }
]);