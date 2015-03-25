DuckieDocs.controller('CompanyCtrl', ['Company', 'Documents', '$state',
    function(Company, Documents, $state) {
        this.Company = Company;
        this.Documents = Documents;

        this.go = function(Doc) {
            $state.go('document', {
                id: Doc.ID_Document
            });
        }
    }
]);