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

        $scope.login = function() {
            function openDatabase() {
                CRUD.setAdapter(new CRUD.SQLiteAdapter('duckiedocs_' + $scope.userModel.username, {
                    estimatedSize: 512 * 1024 * 1024
                }));
            }

            Security.isExistingUser($scope.userModel.username).then(function(isExisting) {
                if (!isExisting) {
                    console.log("New user! Creating new database.");
                    openDatabase();
                    Security.username = $scope.userModel.username;
                    Security.password = $scope.userModel.password;

                } else {
                    Security.decryptDatabase($scope.userModel.username, $scope.userModel.password).then(function(success) {
                        Security.username = $scope.userModel.username;
                        Security.password = $scope.userModel.password;
                        console.log("Login success!", success);
                        openDatabase();
                    }, function(error) {
                        console.error("Login error!", error);
                        $scope.error = error;
                    })
                }
            })
        }
    }
])