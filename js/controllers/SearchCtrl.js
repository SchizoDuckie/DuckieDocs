DuckieDocs
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
.filter('andFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
})
    .controller('SearchCtrl', ["$state", "$scope",

        function($state, $scope) {

            var vm = this;

            this.assignCompany = null;

            this.companies = [];

            this.countSelected = function() {
                var count = 0;

                this.searchResults.map(function(doc) {
                    if (doc.selected) {
                        count++;
                    }
                });
                return count;

            }

            CRUD.Find('Company').then(function(companies) {
                vm.companies = companies;
                $scope.$applyAsync();

            })

            this.selectAll = function() {
                this.searchResults.map(function(doc) {
                    doc.selected = true;
                })
            }

            this.selectNone = function() {
                this.searchResults.map(function(doc) {
                    doc.selected = false;
                })
            }

            this.selectNoCompany = function() {
                this.searchResults.map(function(doc) {
                    doc.selected = !doc.ID_Company;
                })
            }

            this.findNoCompany = function() {
                CRUD.Find('Document', [
                    'ID_Company is null'
                ]).then(function(result) {
                    vm.searchResults = result;
                    $scope.$applyAsync();
                })
            }

            this.searchModel = {
                query: ''
            };

            this.searchFields = [{
                key: 'query',
                type: 'md-input',
                templateOptions: {
                    type: 'search',
                    label: 'Find a document',
                    placeholder: 'Enter your search query'
                }
            }];

            this.assignCompanyToSelected = function() {
                this.searchResults.map(function(doc) {
                    if (doc.selected) {
                        doc.ID_Company = vm.assignCompany.ID_Company;
                        doc.Persist().then(function() {
                            $scope.$applyAsync();
                        })
                    }
                })
            }

            this.searchResults = [];

            this.search = function() {
                vm.searchResults = [];
                CRUD.EntityManager.getAdapter().db.execute("select Documents.* from FullTextSearch left join Documents on FullTextSearch.ID_Document = Documents.ID_Document where fulltext match ?", [this.searchModel.query]).then(function(result) {
                    for (var i = 0; i < result.rs.rows.length; i++) {
                        vm.searchResults.push(CRUD.fromCache(Document, result.rs.rows.item(i)));
                    }
                    $scope.$applyAsync();

                });
            };

            this.go = function(doc) {
                $state.go('document', {
                    id: doc.ID_Document
                });
            }

            this.getCompanyName = function(doc) {
                if (doc.ID_Company) {
                    if (doc.cachedName) {
                        return doc.cachedName;
                    }
                    return CRUD.FindOne('Company', {
                        ID_Company: doc.ID_Company
                    }).then(function(result) {
                        doc.cachedName = result.name;
                        setTimeout($scope.$applyAsync());
                        return result.name;
                    })
                }
            }

        }
    ]);