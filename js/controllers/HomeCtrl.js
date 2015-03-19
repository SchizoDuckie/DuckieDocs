DuckieDocs.controller('HomeCtrl', ["Security", "DocumentsList", "$scope",
    function(Security, DocumentsList, $scope) {

        var self = this;

        this.username = Security.username;

        this.documentsList = DocumentsList;

        setTimeout(function() {
            DocumentsList.refresh();
        }, 500)


    }
])