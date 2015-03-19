// system tray settings for Standalone
if (navigator.userAgent.toUpperCase().indexOf('STANDALONE') != -1) {
    // Load library
    var gui = require('nw.gui');

    // Reference to window and tray
    var win = gui.Window.get();


    window.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 123: // F12, show inspector
                win.showDevTools();
                break;
            case 187: // +
                if (event.ctrlKey == true) {
                    win.zoomLevel = win.zoomLevel + 0.25;
                }
                break;
            case 189: // -
                if (event.ctrlKey == true) {
                    win.zoomLevel = win.zoomLevel - 0.25;
                }
                break;
            case 48: // 0
                if (event.ctrlKey == true) {
                    win.zoomLevel = 1;
                }
        }
    });

    window.ondragover = function(e) {
        if (window.location.hash != '#/upload') {
            window.location.hash = '#/upload';
        }
        e.preventDefault();
        return false
    };
    window.ondrop = function(e) {
        e.preventDefault();
        return false
    };

    document.body.ondragover = function() {
        this.className = 'draghover';
        return false;
    };
    document.body.ondragleave = function() {
        this.className = '';
        return false;
    };
    document.body.ondrop = function(e) {
        e.preventDefault();

        $rootScope = angular.element(document.body).injector().get('$rootScope');
        for (var i = 0; i < e.dataTransfer.files.length; ++i) {
            $rootScope.$broadcast('handle:drag', e.dataTransfer.files[i]);
        }
        this.className = '';

        return false;
    };

    DuckieDocs.directive('target', function() {
        return {
            restrict: 'A',
            scope: '=',
            link: function($scope, element) {
                if (element[0].getAttribute('target')) {
                    if (element[0].getAttribute('target').toLowerCase() == '_blank') {
                        element[0].onclick = function(e) {
                            window.open(element[0].getAttribute('href'), '_blank');
                            return false;
                        }
                    }
                }
            }
        };
    });
}