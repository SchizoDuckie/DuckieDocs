/** CURRENTLY UNUSED!
 * Standalone Google search capabilities.
 * Provides Google search results.
 */

DuckieDocs.provider('GoogleImages', function() {

    this.endpoints = {
        searchLogo: 'https://www.google.nl/search?q=%s+logo&source=lnms&tbm=isch&sa=X',
    };

    this.getUrl = function(type, query) {
        return this.endpoints[type].replace('%s', encodeURIComponent(query));
    }

    this.parseSearch = function(result) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(result.data, "text/html");
        return Array.prototype.map.call(doc.querySelectorAll('.images_table td a img'), function(element) {
            return element.src
        });
    }

    this.$get = ["$q", "$http",
        function($q, $http) {
            var self = this;
            return {
                findLogo: function(what) {
                    var d = $q.defer();
                    $http({
                        method: 'GET',
                        url: self.getUrl('searchLogo', what),
                        cache: true
                    }).then(function(response) {
                        d.resolve(self.parseSearch(response));
                    }, function(err) {
                        console.log('error!');
                        d.reject(err);
                    });
                    return d.promise;
                }
            }
        }
    ]
})