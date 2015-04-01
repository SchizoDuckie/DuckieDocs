DuckieDocs.controller('CompanyCtrl', ['Company', 'Documents', '$state', '$scope',
    function(Company, Documents, $state, $scope) {

        var vm = this;

        this.Company = Company;
        this.Documents = Documents;

        this.go = function(Doc) {
            $state.go('document', {
                id: Doc.ID_Document
            });
        }

        this.searchResults = [];

        CRUD.EntityManager.getAdapter().db.execute("select Documents.* from FullTextSearch left join Documents on FullTextSearch.ID_Document = Documents.ID_Document where fulltext match ?", [this.Company.name]).then(function(result) {
            for (var i = 0; i < result.rs.rows.length; i++) {
                vm.searchResults.push(CRUD.fromCache(Document, result.rs.rows.item(i)));
            }
            $scope.$applyAsync();

        });

    }
]);