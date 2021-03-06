DuckieDocs.controller('UploadCtrl', ["Security", "DocumentsList", "$rootScope", "$scope",
    function(Security, DocumentsList, $rootScope, $scope) {
        var self = this;
        this.saved = false;

        this.uploadModel = new Document();

        this.uploadQueue = [];

        this.documents = [];

        this.uploadFields = [{
            key: 'name',
            type: 'md-input',
            templateOptions: {
                type: 'text',
                label: 'Document name',
                placeholder: 'Give it a name'
            }
        }, {
            key: 'document',
            type: 'md-input',
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

            if (!doc.name || doc.name == 'waiting...') {
                doc.name = file.name;
            }

            doc.Persist().then(function(res) {

                var filepath = doc.filepath = '/documents/' + doc.getID() + '-' + file.name;
                Security.encryptFile(file.path, require('path').resolve(process.cwd()) + filepath + '.encrypted', Security.password);
                self.saved = true;


                if (file.path.indexOf('.pdf') > -1) {
                    self.pdfToText(file.path, filepath + '.png').then(function(result) {
                        doc.isConverted = 1;
                        doc.image = filepath + '.png';
                        doc.Persist().then(function() {

                            var ft = new FullTextSearch();
                            ft.ID_Document = doc.ID_Document;
                            ft.fulltext = result;
                            ft.Persist().then(function() {
                                doc = null;
                                ft = null;
                            })
                            setTimeout(function() {
                                DocumentsList.refresh();

                            })
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
            var doc = new Document();
            doc.name = 'waiting...';
            self.uploadQueue.push(doc);
            setTimeout(function() {
                self.persist(doc, file);
            }, self.uploadQueue.length);
            $scope.$applyAsync();
        })



        /**
         * Extract text from PDFs with PDF.js
         * Uses the demo pdf.js from https://mozilla.github.io/pdf.js/getting_started/
         */
        this.pdfToText = function(pdfPath, imagePath) {

            PDFJS.workerSrc = 'js/vendor/pdf.worker.js';
            PDFJS.cMapUrl = 'js/vendor/pdfjs/cmaps/';
            PDFJS.cMapPacked = true;
            PDFJS.disableWorker = true; // crashes due to out of memory when enabled and uploading loads of files.

            function createThumbnail(page, imagePath) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var viewport = page.getViewport(0.7);
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                page.render({
                    canvasContext: ctx,
                    viewport: viewport
                }).then(function() {
                    ctx.globalCompositeOperation = "destination-over";
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    require('fs').writeFileSync(require('path').resolve(process.cwd()) + imagePath, new Buffer(canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""), 'base64'));
                    delete viewport;
                    delete page;
                    delete canvas;
                    delete ctx;
                });
            }

            return PDFJS.getDocument(pdfPath).then(function(pdf) { //read pdf into memory
                var pages = new Array(pdf.numPages).toString().split(','); // create a new array as much values as pages
                return Promise.all(pages.map(function(str, pageNumber) { //iterate these numbers
                    return pdf.getPage(pageNumber + 1).then(function(page) { // grab page handle
                        console.log('Process page: ', pageNumber);
                        if (pageNumber == 0) createThumbnail(page, imagePath); // create thumb nail for first page.
                        return page.getTextContent().then(function(textContent) { // fetch textcontent from page
                            page = null;
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