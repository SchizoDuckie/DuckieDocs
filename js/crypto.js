DuckieDocs.factory('Security', function() {

    var crypto = require('crypto');

    var service = {

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



        verifyDbExistence: function() {
            service.query("SELECT rowid AS id, origin,name,description,estimated_size FROM Databases").then(function(row) {
                console.log("Fetched db sqlite rows", row);
            })
        }

    };
    return service;
});