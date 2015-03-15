/**
 * Actionbar Controller
 */

DuckieDocs.controller('LoginCtrl', ['$scope', 'Security',

    function($scope, Security) {
        $scope.encrypted = '';
        $scope.userModel = {
            username: 'SchizoDuckie',
            password: 'changeme'
        }
        console.log("Login controller created");

        $scope.encrypt = function() {
            $scope.encrypted = Security.encrypt($scope.userModel.username, $scope.userModel.password);

            $scope.decrypted = Security.decrypt($scope.encrypted, $scope.userModel.password);

            Security.encryptFile('index.html', 'index.encrypted.html', $scope.userModel.password).then(function(result) {
                console.log("File encrypted!", result);

                Security.decryptFile(result, 'index.decrypted.html', $scope.userModel.password)
            })
        }

        $scope.findDB = function() {
            Security.verifyDbExistence();

        }
    }
])