DuckieDocs

.directive('company', function() {

    return {
        restrict: 'E',
        templateUrl: function(iElement, iAttr) {
            return iAttr.$attr.editor ? 'templates/directives/addCompany.html' : 'templates/directives/company.html';
        },
        controllerAs: 'vm',
        scope: {
            id: '@'
        },
        link: function($scope, iElement, iAttr) {
            $scope.id = $scope.entity;
            console.log('entity!', $scope);

        },
        controllerAs: 'vm',
        controller: function($scope, $mdDialog, GoogleImages) {

            var vm = this;
            this.imageSuggestions = [];

            if ($scope.id == "") {
                $scope.company = this.company = new Company();
            }


            this.selectImage = function(image) {
                console.log("Select company image!", image);
                var path = require('path'),
                    fs = require('fs'),
                    baseDir = path.resolve(process.cwd()),
                    path = baseDir + '/documents/CompanyImages',
                    fileName = this.company.ID_Company + '-' + new Date().getTime() + '.png';

                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
                var file = fs.createWriteStream(path + '/' + fileName);
                file.on('finish', function() {
                    file.close(function() {
                        vm.company.image = fileName;
                        vm.company.Persist();
                        $scope.$applyAsync();
                    });
                });
                require(image.indexOf('https') == 0 ? 'https' : 'http').get(image, function(response) {
                    response.pipe(file);
                });
            }

            this.chooseLogo = function() {
                GoogleImages.findLogo(this.company.name).then(function(result) {
                    vm.imageSuggestions = result;
                    $scope.$applyAsync();
                })
            }

            this.saveCompany = function() {
                this.company.Persist().then(function() {
                    vm.Document.ID_Company = vm.Company.ID_Company;
                    vm.Document.Persist();

                });
            }



            this.addCompany = function($event) {
                $mdDialog.show({
                    targetEvent: $event,
                    templateUrl: 'templates/directives/addCompanyDialog.html',
                    controllerAs: 'vm',
                    controller: function(company, companyFields, imageSuggestions) {
                        this.company = company;
                        this.companyFields = companyFields;
                        this.imageSuggestions = imageSuggestions;
                        this.chooseLogo = vm.chooseLogo;
                    },
                    locals: {
                        company: this.company,
                        companyFields: this.companyFields,
                        imageSuggestions: this.imageSuggestions
                    }
                });
            }


            this.companyFields = [{
                key: 'name',
                type: 'md-input',
                templateOptions: {
                    type: 'text',
                    label: 'Company Name',
                    placeholder: 'ACME B.V.',
                    onChange: function(value, options, scope) {
                        vm.chooseLogo()
                    }
                },
                modelOptions: {
                    debounce: {
                        'default': 500,
                        'blur': 0
                    },


                },



            }, {
                key: 'address',
                type: 'md-input',
                templateOptions: {
                    type: 'text',
                    label: 'Address',
                    placeholder: 'Streetname XX'
                }
            }, {
                key: 'city',
                type: 'md-input',
                templateOptions: {
                    type: 'text',
                    label: 'City',
                    placeholder: 'Arkham City'
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