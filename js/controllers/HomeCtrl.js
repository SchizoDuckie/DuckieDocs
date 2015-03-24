DuckieDocs.controller('HomeCtrl', ["Security", "DocumentsList", "$scope", "$state",
    function(Security, DocumentsList, $scope, $state) {

        var self = this;

        this.username = Security.username;

        this.documentsList = DocumentsList;

        setTimeout(function() {
            DocumentsList.refresh();
        }, 500)

        this.go = function(doc) {
            $state.go('document', {
                id: doc.ID_Document
            });

        }


    }
])