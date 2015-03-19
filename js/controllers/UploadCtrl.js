DuckieDocs.controller('UploadCtrl', ["Security", "DocumentsList", "$rootScope", "$scope",
    function(Security, DocumentsList, $rootScope, $scope) {
        var self = this;
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

            this.persist(self.uploadModel, files[0]);
        }


        this.persist = function(doc, file) {
            doc.Persist().then(function() {
                doc.filepath = file.path;
                if (!doc.name) {
                    doc.name = file.name;
                }
                self.saved = true;
                Security.encryptFile(file.path, './documents/' + doc.ID_Document + '-' + file.name + '.encrypted', Security.password);

                if (file.path.indexOf('.pdf') > -1) {
                    self.pdfToText(file.path).then(function(result) {
                        doc.isConverted = 1;
                        doc.Persist().then(function() {
                            var content = new DocumentContent();
                            content.fulltext = result;
                            content.ID_Document = doc.ID_Document;
                            content.Persist().then(function() {
                                doc.ID_DocumentContent = content.ID_DocumentContent;
                                doc.Persist();
                            })

                            DocumentsList.refresh();

                        })

                    });
                }
                $scope.$applyAsync();
            });

        }

        /**
         * Incoming event firing for every file dropped from desktop.
         */
        $rootScope.$on('handle:drag', function(evt, file) {
            console.log("Drop detected", file);
            self.persist(new Document(), file);
        })

        /**
         * Extract text from PDFs with PDF.js
         * Uses the demo pdf.js from https://mozilla.github.io/pdf.js/getting_started/
         */
        this.pdfToText = function(data) {

            PDFJS.workerSrc = 'js/vendor/pdf.worker.js';
            PDFJS.cMapUrl = 'js/vendor/pdfjs/cmaps/';
            PDFJS.cMapPacked = true;

            function createThumbnail(page) {
                var viewport = page.getViewport(0.5);
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                page.render({
                    canvasContext: ctx,
                    viewport: viewport
                }).then(function() {
                    ctx.globalCompositeOperation = "destination-over";
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    var img = document.createElement('img');
                    img.src = canvas.toDataURL();
                    document.body.appendChild(img);
                });

            }

            return PDFJS.getDocument(data).then(function(pdf) { //read pdf into memory
                var pages = new Array(pdf.numPages).toString().split(','); // create a new array as much values as pages
                return Promise.all(pages.map(function(str, pageNumber) { //iterate these numbers
                    return pdf.getPage(pageNumber + 1).then(function(page) { // grab page handle
                        console.log('Process page: ', pageNumber);
                        if (pageNumber == 0) createThumbnail(page); // create thumb nail for first page.
                        return page.getTextContent().then(function(textContent) { // fetch textcontent from page
                            return textContent.items.map(function(item) { // join all text on page by ' '
                                return item.str;
                            }).join(' ');
                        });
                    });
                })).then(function(pages) { // join pages array, end chain. 
                    return pages.join("\r\n\r\n");
                });
            });
        }
    }
])