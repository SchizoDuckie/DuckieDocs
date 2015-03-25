DuckieDocs.controller('SearchCtrl', ["$state", "$scope",

    function($state, $scope) {

        var vm = this;
        this.searchModel = {
            query: ''
        };

        this.searchFields = [{
            key: 'query',
            type: 'input',
            templateOptions: {
                type: 'search',
                label: 'Find a document',
                placeholder: 'Enter your search query'
            }
        }];

        this.searchResults = [];

        this.search = function() {
            this.searchResults = [];

            CRUD.Find('FullTextSearch', ['fulltext match "' + this.searchModel.query + '"']).then(function(results) {

                console.log('results', results);
                results.map(function(result) {
                    CRUD.FindOne('Document', {
                        ID_Document: result.ID_Document
                    }).then(function(doc) {
                        vm.searchResults.push(doc);
                        $scope.$applyAsync();
                    })
                })

            });
        }

        this.go = function(doc) {
            $state.go('document', {
                id: doc.ID_Document
            });

        }

    }
]);