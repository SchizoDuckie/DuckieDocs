DuckieDocs.factory('Security', function() {

    var crypto = require('crypto');

    var service = {
        username: null,
        password: null,

        sha1: function(string) {
            crypto.createHash('sha1').update(string).digest("hex")
        },

        encryptFile: function(inputFile, outputFile, password) {
            return new Promise(function(resolve, fail) {
                var fs = require('fs'),
                    zlib = require('zlib');

                var cipher = crypto.createCipher('aes-256-cbc', password),
                    input = fs.createReadStream(inputFile),
                    output = fs.createWriteStream(outputFile),
                    zip = zlib.createGzip();

                input.pipe(zip).pipe(cipher).pipe(output);

                output.on('finish', function() {
                    console.log('Encrypted file written to disk!');
                    resolve(outputFile);
                });
            })
        },

        decryptFile: function(inputFile, outputFile, password) {
            return new Promise(function(resolve, fail) {
                var fs = require('fs'),
                    zlib = require('zlib');

                var decipher = crypto.createDecipher('aes-256-cbc', password),
                    input = fs.createReadStream(inputFile),
                    output = fs.createWriteStream(outputFile),
                    unzip = zlib.createGunzip();

                input.pipe(decipher).pipe(unzip).pipe(output);

                output.on('finish', function() {
                    console.log('Decrypted file written to disk!', outputFile);
                    resolve(outputFile);
                });
            })
        },


        encrypt: function(string, password) {
            var cipher = crypto.createCipher('aes-256-cbc', password)
            var crypted = cipher.update(string, 'utf8', 'hex')
            crypted += cipher.final('hex');
            return crypted;
        },

        decrypt: function(string, password) {
            var decipher = crypto.createDecipher('aes-256-cbc', password)
            var dec = decipher.update(string, 'hex', 'utf8')
            dec += decipher.final('utf8');
            return dec;
        },

        encryptBuffer: function(buffer, password) {
            var cipher = crypto.createCipher('aes-256-cbc', password)
            var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
            return crypted;
        },

        decryptBuffer: function(buffer, password) {
            var decipher = crypto.createDecipher('aes-256-cbc', password)
            var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
            return dec;
        },

        query: function(query) {
            console.log("Executing query on node-webkit databases db", query);
            return new Promise(function(resolve, reject) {

                var exec = require('child_process').exec;
                var path = require('path')
                var parentDir = path.resolve(process.cwd());

                var cmd = path.resolve(parentDir + '/node_modules/sqlite3/sqlite3.exe');
                var database = path.resolve(parentDir + '/webkit-data/databases/Databases.db');

                exec([cmd, database, "\"" + query + "\""].join(' '), {
                        cwd: parentDir
                    },
                    function(error, result) {
                        console.log("SQL done: ", error, result);
                        resolve(result.trim().split("\n").map(function(row) {
                            return row.split('|');
                        }));
                    })

            });
        },

        isExistingUser: function(username) {
            return service.query("SELECT rowid AS id, origin,name,description,estimated_size FROM Databases").then(function(rows) {
                return rows.filter(function(row) {
                    return row[2] == 'duckiedocs_' + username;
                }).length == 1
            })
        },

        decryptDatabase: function(username, password) {
            return new Promise(function(resolve, reject) {
                service.query("SELECT rowid FROM Databases where name=\'duckiedocs_" + username + "\'").then(function(result) {
                    console.log("Database id : ", result, username, password);

                    var path = require('path'),
                        parentDir = path.resolve(process.cwd()),
                        fs = require('fs'),
                        encryptedDatabase = path.resolve(parentDir + '/webkit-data/databases/file__0/' + result[0][0]) + '.encrypted';

                    var database = encryptedDatabase.replace('.encrypted', '');

                    fs.exists(encryptedDatabase, function(exists) {
                        if (exists) {
                            service.decryptFile(encryptedDatabase, database, password).then(function(result) {
                                resolve(true);
                                fs.unlink(encryptedDatabase, function(result) {
                                    console.log('deleted encrypted db');
                                });
                            })
                        } else {
                            console.log("No decrypted database found");
                            resolve(true);
                        }
                    })
                })
            })
        },

        shutdown: function() {
            return new Promise(function(resolve, reject) {
                window.location.reload();
                service.query("SELECT rowid FROM Databases where name=\'duckiedocs_" + service.username + "\'").then(function(result) {

                    var path = require('path'),
                        parentDir = path.resolve(process.cwd()),
                        database = path.resolve(parentDir + '/webkit-data/databases/file__0/' + result[0][0]);

                    var encryptedDatabase = database + '.encrypted';
                    service.encryptFile(database, encryptedDatabase, service.password).then(function(result) {
                        console.log('Encryption done. removing original db.');
                        require('del')(database, {
                            force: true
                        });
                        console.log('unlink done', database);;
                        resolve(true);
                    })
                    console.log("Shutdown event! Encrypt database");
                })

            })
        }

    };
    return service;
}).run(function(Security) {

    require('nw.gui').Window.get().on('close', function() {
        this.hide(); // Pretend to be closed already
        Security.shutdown().then(function() {
            console.log("Shutdown and encryption completed. closing app.");
            this.close(true);
            require('nw.gui').App.quit();
        })
    });

})