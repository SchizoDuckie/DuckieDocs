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

    }
]);