DuckieDocs.controller('HomeCtrl', ["Security", "DocumentsList", "$scope", "$state",
    function(Security, DocumentsList, $scope, $state) {

        var vm = this;

        this.username = Security.username;

        this.documentsList = DocumentsList;

        setTimeout(function() {
            DocumentsList.refresh();
        }, 500)

        this.companies = [];

        CRUD.Find('Company').then(function(result) {
            vm.companies = result.map(function(el) {
                el.docCount = '...';
                CRUD.FindCount('Document', {
                    ID_Company: el.ID_Company
                }).then(function(result) {
                    el.docCount = result;
                })
                return el;
            })
        })

        this.go = function(doc) {
            $state.go('document', {
                id: doc.ID_Document
            });

        }


    }
])