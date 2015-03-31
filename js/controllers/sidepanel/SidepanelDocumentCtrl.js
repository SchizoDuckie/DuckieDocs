var CompanyImageSlurper = function(Company) {

    var path = require('path'),
        fs = require('fs'),
        baseDir = path.resolve(process.cwd());

    this.Company = Company;
    this.savePath = baseDir + '/documents/CompanyImages';

    this.setSavePath = function(path) {
        this.savePath = baseDir + path;
    }

    this.setCompany = function(company) {
        this.Company = company;
    }

    this.save = function(image) {
        return new Promise(function(resolve, reject) {
            if (!this.Company.ID_Company) {
                throw "Company is not persisted yet! Can't save an image";
            }

            var fileName = this.Company.ID_Company + '-' + new Date().getTime() + '.png';

            if (!fs.existsSync(this.savePath)) {
                fs.mkdirSync(this.savePath);
            }
            var file = fs.createWriteStream(this.savePath + '/' + fileName);
            file.on('finish', function() {
                file.close(function() {
                    this.Company.image = fileName;
                    this.Company.Persist();
                    resolve(Company);
                });
            });
            require(image.indexOf('https') == 0 ? 'https' : 'http').get(image, function(response) {
                response.pipe(file);
            });
        })
    }

}

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

        this.getCompanyList = function() {
            CRUD.Find('Company').then(function(result) {
                vm.companies = result;
                $scope.$applyAsync();
            });
        }

        this.saveCompany = function() {
            this.Company.Persist().then(function() {
                vm.Document.ID_Company = vm.Company.ID_Company;
                vm.Document.Persist();

            });
        }

    }
]);