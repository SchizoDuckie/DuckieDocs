DuckieDocs.controller('SidepanelDocumentCtrl', ['$scope', '$state', 'Document', 'GoogleImages',
    function($scope, $state, Document, GoogleImages) {
        var vm = this;

        this.Document = Document;
        this.Company = null;
        this.companies = [];
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

        this.selectCompany = function(company) {
            this.Document.ID_Company = company.ID_Company;
            this.Document.Persist();
            this.Company = company;
            $scope.$applyAsync();
        }

        this.selectImage = function(image) {
            console.log("Select company image!", image);
            var path = require('path'),
                fs = require('fs'),
                baseDir = path.resolve(process.cwd()),
                path = baseDir + '/documents/CompanyImages',
                fileName = this.Company.ID_Company + '-' + new Date().getTime() + '.png';

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            var file = fs.createWriteStream(path + '/' + fileName);
            file.on('finish', function() {
                file.close(function() {
                    vm.Company.image = fileName;
                    vm.Company.Persist();
                    $scope.$applyAsync();
                });
            });
            require(image.indexOf('https') == 0 ? 'https' : 'http').get(image, function(response) {
                response.pipe(file);
            });
        }

        this.getCompanyList = function() {
            CRUD.Find('Company').then(function(result) {
                vm.companies = result;
                $scope.$applyAsync();
            });
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
        }];


    }
]);