/**
 * Generic wrapper to save some asset like an image from http or https and to a file.
 */
var HTTPSlurper = function(url) {


    var self = this,
        path = require('path'),
        fs = require('fs'),
        baseDir = path.resolve(process.cwd());


    this.setSavePath = function(path) {
        this.basePath = path;
        this.savePath = baseDir + path;
        if (!fs.existsSync(this.savePath)) {
            console.log('creating path: ', this.savePath);
            fs.mkdirSync(this.savePath);
        }
        return this;
    }

    this.setSavePath('/documents/CompanyImages');

    this.save = function(image, localFileName) {
        return new Promise(function(resolve, reject) {

            var file = fs.createWriteStream([self.savePath, localFileName].join('/'));
            file.on('finish', function() {
                file.close(function() {
                    resolve([self.basePath, localFileName].join('/'));
                });
            });
            require(image.indexOf('https') == 0 ? 'https' : 'http').get(image, function(response) {
                response.pipe(file);
            });
        })
    }

    return this;
}