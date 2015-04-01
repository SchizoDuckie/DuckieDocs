DuckieDocs.controller('CompaniesCtrl', ['Companies', '$scope', '$state',
    function(Companies, $scope, $state) {
        var vm = this;

        this.companies = [];
        Companies.map(addCompanyWithCount);



        this.Company = new Company();


        function addCompanyWithCount(company) {
            CRUD.FindCount('Document', {
                ID_Company: company.ID_Company
            }).then(function(count) {
                company.docCount = count;
                $scope.$applyAsync();
                vm.companies.push(company);
            })
        }

        $scope.$on('Company:created', function(evt, args) {
            console.log("Company created!", evt, args);
            addCompanyWithCount(args);
        });


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