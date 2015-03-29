DuckieDocs.controller('DocumentCtrl', ['$scope', '$state', 'Document', 'Security',
    function($scope, $state, Document, Security) {

        var vm = this;

        this.Document = Document;

        this.Document.lastAccessed = new Date().getTime();
        this.Document.openedCount++;
        this.Document.Persist();

        $scope.pdf = vm.pdf = null;
        console.log('Decrypting PDF', new Date().toTimeString());
        Security.decryptToBuffer(process.cwd() + Document.filepath + '.encrypted', Security.password).then(function(result) {
            console.log('PDF decyrpted', new Date().toTimeString());
            PDFJS.workerSrc = 'js/vendor/pdf.worker.js';
            PDFJS.cMapUrl = 'js/vendor/pdfjs/cmaps/';
            PDFJS.cMapPacked = true;
            PDFJS.disableWorker = true; // crashes due to out of memory when enabled and uploading loads of files.

            $scope.pdf = vm.pdf = new Uint8Array(result);
            $scope.$applyAsync();
        })


    }
]);