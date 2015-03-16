DuckieDocs.controller('HomeCtrl', ["Security", "$scope",
    function(Security, $scope) {


        var self = this;

        this.username = Security.username;

        this.saved = false;

        this.uploadModel = new Document();

        this.documents = [];

        this.uploadFields = [{
            key: 'name',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Document name',
                placeholder: 'Give it a name'
            }
        }, {
            key: 'document',
            type: 'input',
            templateOptions: {
                type: 'file',
                label: 'Upload a document',
                placeholder: 'Pick a file'
            }
        }];

        this.upload = function() {
            var input = document.querySelector('input[type=file]');
            var files = input.files;
            this.uploadModel.filepath = files[0].path;
            this.uploadModel.Persist().then(function() {
                console.log('done!', self);
                self.saved = true;
                $scope.$applyAsync();
            });

        }

        CRUD.Find('Document').then(function(documents) {
            self.documents = documents;
            $scope.$applyAsync();
        })

    }
])