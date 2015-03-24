DuckieDocs.controller('SidepanelDocumentCtrl', ['$scope', '$state', 'Document', 'GoogleImages',
    function($scope, $state, Document, GoogleImages) {
        var vm = this;

        this.Document = Document;
        this.Company = null;
        this.imageSuggestions = [];

        if (this.Document.ID_Company == null) {
            this.Company = new Company();
        } else {
            CRUD.FindOne('Company', {
                ID_Company: this.Document.ID_Company
            }).then(function(company) {
                vm.Company = company;
                $scope.$applyAsync();
            })
        }

        this.refresh = function() {
            //debugger;
        }

        this.findLogo = function() {
            GoogleImages.findLogo(this.Company.name).then(function(result) {
                vm.imageSuggestions = result;
                $scope.$applyAsync();
            })
        }

        this.saveCompany = function() {
            this.Company.Persist().then(function() {
                vm.Document.ID_Company = vm.Company.ID_Company;
                vm.Document.Persist();

            });
        }

        this.companyFields = [{
            key: 'name',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Company Name',
                placeholder: 'ACME B.V.'
            }
        }, {
            key: 'address',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Address',
                placeholder: 'Streetname XX'
            }
        }, {
            key: 'country',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Country',
                placeholder: 'NomansLand'
            }
        }, {
            key: 'image',
            type: 'input',
            templateOptions: {
                type: 'url',
                label: 'image',
                placeholder: 'select image'
            }
        }];


    }
]);