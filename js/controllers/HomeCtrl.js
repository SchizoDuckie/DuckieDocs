DuckieDocs.controller('HomeCtrl', ["Security", "$scope",
    function(Security, $scope) {

        this.username = Security.username;

        this.saved = false;

        this.uploadModel = new Document();

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

        var self = this;

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

    }
])