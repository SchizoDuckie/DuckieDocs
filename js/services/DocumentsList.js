DuckieDocs.factory('DocumentsList', ["$rootScope",

    function($rootScope) {

        getDocumentsList = function() {
            return CRUD.Find('Document').then(function(documents) {
                service.all = documents;
                return documents;
            })
        }

        var service = {
            all: [],

            refresh: function() {
                getDocumentsList().then(function() {
                    setTimeout(function() {
                        $rootScope.$applyAsync();
                    })
                })
            }

        }

        return service;

    }
])