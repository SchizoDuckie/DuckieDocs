DuckieDocs

.directive('company', function() {

    return {
        restrict: 'E',
        templateUrl: function(iElement, iAttr) {
            return iAttr.$attr.editor ? 'templates/directives/addCompany.html' : 'templates/directives/company.html';
        },
        scope: {
            id: '@',
            company: '@'
        },
        controllerAs: 'vm',
        controller: function($scope, $mdDialog, GoogleImages) {

            var vm = this;
            this.imageSuggestions = [];

            $scope.company = this.company = new Company();

            if ($scope.id) {
                CRUD.FindOne('Company', {
                    ID_Company: $scope.id
                }).then(function(result) {
                    $scope.company = vm.company = result;
                    $scope.$applyAsync();
                })
            }

            this.chooseLogo = function() {
                return GoogleImages.findLogo(this.company.name).then(function(result) {
                    vm.imageSuggestions = result;
                    vm.selectedImage = result[0];
                    $scope.$applyAsync();
                    return result;
                })
            }

            this.saveCompany = function() {
                console.log("Save company");
                if (!this.company.ID_Company) {
                    vm.isNew = true;
                }
                this.company.Persist().then(function() {
                    new HTTPSlurper().save(vm.selectedImage, vm.company.ID_Company + '-' + new Date().getTime() + '.png').then(function(savePath) {
                        vm.company.image = savePath;
                        vm.company.Persist().then(function(result) {
                            if (vm.isNew) {
                                $scope.$root.$broadcast('Company:created', vm.company);
                                $scope.$applyAsync();
                                vm.isNew = false;
                            }
                        })
                    });
                });
            }



            this.addCompany = function($event) {
                var dialog = $mdDialog.show({
                    targetEvent: $event,
                    templateUrl: 'templates/directives/addCompanyDialog.html',
                    controllerAs: 'vm',
                    controller: function(company, companyFields, $scope, saveFunc) {
                        var self = this;
                        this.company = company;
                        this.companyFields = companyFields;
                        this.imageSuggestions = [];
                        this.selectedImage = null;
                        this.hideSaveButton = true;

                        this.companyFields[0].templateOptions.onChange = function() {
                            GoogleImages.findLogo(self.company.name).then(function(result) {
                                self.imageSuggestions = result;
                                self.selectedImage = result[0];
                                $scope.$applyAsync();

                            });
                        }

                        this.saveCompany = function() {
                            this.company.Persist().then(function() {
                                new HTTPSlurper().save(self.selectedImage, self.company.ID_Company + '-' + new Date().getTime() + '.png').then(function(savePath) {
                                    self.company.image = savePath;
                                    self.company.Persist();
                                });
                            });
                        }

                        this.closeDialog = function() {
                            console.log('close dialog!');
                            var isNew = self.company.ID_Company === undefined;
                            self.company.Persist().then(function() {
                                $mdDialog.hide();
                                $scope.$applyAsync(function() {
                                    $scope.$root.$broadcast('save');
                                    if (isNew) {
                                        $scope.$root.$broadcast('Company:created', self.company);
                                    }
                                })
                            })

                        }


                    },
                    locals: {
                        company: this.company,
                        companyFields: this.companyFields,
                        scope: $scope,
                        saveFunc: $scope.onSave
                    }
                })
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
                    }
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