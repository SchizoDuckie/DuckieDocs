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
            this.uploadModel.filepath = files[0].name;
            if (!this.uploadModel.name) {
                this.uploadModel.name = files[0].name;
            }

            this.uploadModel.Persist().then(function() {
                console.log('done!', self);
                self.saved = true;
                Security.encryptFile(files[0].path, './documents/' + self.uploadModel.ID_Document + '-' + files[0].name + '.encrypted', Security.password);

                if (files[0].path.indexOf('.pdf') > -1) {
                    self.pdfToText(files[0].path).then(function(result) {
                        self.uploadModel.isConverted = 1;
                        self.uploadModel.description = result;
                        self.uploadModel.Persist().then(function(result) {
                            self.uploadModel = new Document();
                            self.getDocumentsList();
                        })
                    });
                }

                $scope.$applyAsync();
            });

        }

        /**
         * Extract text from PDFs with PDF.js
         * Uses the demo pdf.js from https://mozilla.github.io/pdf.js/getting_started/
         */
        this.pdfToText = function(data) {

            PDFJS.workerSrc = 'js/vendor/pdf.worker.js';
            PDFJS.cMapUrl = 'js/vendor/pdfjs/cmaps/';
            PDFJS.cMapPacked = true;

            return PDFJS.getDocument(data).then(function(pdf) {
                var pages = [];
                for (var i = 0; i < pdf.numPages; i++) {
                    pages.push(i);
                }
                return Promise.all(pages.map(function(pageNumber) {
                    return pdf.getPage(pageNumber + 1).then(function(page) {
                        return page.getTextContent().then(function(textContent) {
                            return textContent.items.map(function(item) {
                                return item.str;
                            }).join(' ');
                        });
                    });
                })).then(function(pages) {
                    return pages.join("\r\n");
                });
            });
        }

        this.getDocumentsList = function() {
            CRUD.Find('Document').then(function(documents) {
                self.documents = documents;
                $scope.$applyAsync();
            })
        }

        this.getDocumentsList();


    }
])