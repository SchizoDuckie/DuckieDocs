DuckieDocs.controller('DocumentCtrl', ['$scope', '$state', 'Document', 'Security',
    function($scope, $state, Document, Security) {

        var vm = this;

        this.Document = Document;
        this.Document.lastAccessed = new Date().getTime();
        this.Document.openedCount++;
        this.Document.Persist();

        this.Company = new Company();

        if (this.Document.ID_Company) {
            CRUD.FindOne('Company', {
                ID_Company: this.Document.ID_Company
            }).then(function(company) {
                vm.Company = company;
                $scope.$applyAsync();
            })
        }

        this.save = function() {
            console.log("Saving document!");
            this.Document.Persist();
        }

        $scope.$on('Company:created', function(evt, company) {
            vm.Document.ID_Company = company.ID_Company;
            vm.save();
        })

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