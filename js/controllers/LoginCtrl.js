/**
 * Actionbar Controller
 */

DuckieDocs.controller('LoginCtrl', ['Security', '$state',
    function(Security, $state) {
        this.encrypted = '';


        this.userModel = {
            username: 'SchizoDuckie',
            password: 'changeme'
        }

        this.userFields = [{
            key: 'username',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'User Name',
                placeholder: 'Enter your username'
            }
        }, {
            key: 'password',
            type: 'input',
            templateOptions: {
                type: 'password',
                label: 'Password',
                placeholder: 'Password'
            }
        }];


        var self = this;

        this.login = function() {
            function openDatabase() {
                CRUD.setAdapter(new CRUD.SQLiteAdapter('duckiedocs_' + self.userModel.username, {
                    estimatedSize: 512 * 1024 * 1024
                }));
            }

            Security.isExistingUser(self.userModel.username).then(function(isExisting) {
                if (!isExisting) {
                    console.log("New user! Creating new database.");
                    openDatabase();
                    Security.username = self.userModel.username;
                    Security.password = self.userModel.password;

                } else {
                    Security.decryptDatabase(self.userModel.username, self.userModel.password).then(function(success) {
                        Security.username = self.userModel.username;
                        Security.password = self.userModel.password;
                        console.log("Login success!", success);
                        openDatabase();
                        // only for development reloads. will be removed.
                        localStorage.setItem('security.username', Security.username);
                        localStorage.setItem('security.password', Security.password);
                        $state.go('home');
                    }, function(error) {
                        console.error("Login error!", error);
                        self.error = error;
                    })
                }
            })
        }
    }
])

/**
 * only for dev reloads. will be removed.
 */
.run(function(Security) {
    if (localStorage.getItem('security.username')) {

        Security.username = localStorage.getItem('security.username')
        Security.password = localStorage.getItem('security.password')
        Security.decryptDatabase(Security.username, Security.password).then(function(success) {

            CRUD.setAdapter(new CRUD.SQLiteAdapter('duckiedocs_' + localStorage.getItem('security.username'), {
                estimatedSize: 512 * 1024 * 1024
            }));

        });
    }
})