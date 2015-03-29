DuckieDocs.controller('CompaniesCtrl', ['Companies', '$scope', '$state',
    function(Companies, $scope, $state) {

        this.companies = Companies;
        Companies.map(function(company) {
            CRUD.FindCount('Document', {
                ID_Company: company.ID_Company
            }).then(function(count) {
                company.docCount = count;
                $scope.$applyAsync();
            })
        });


        this.Company = new Company();

        this.go = function(company) {
            $state.go('company', {
                id: company.ID_Company
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
]);