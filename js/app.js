/**
 * Handle global dependencies
 */
var DuckieDocs = angular.module('DuckieDocs', [
    'ui.router',
    'ct.ui.router.extras.core',
    'ct.ui.router.extras.sticky',
    'ngLocale',
    'ngAnimate',
    'tmh.dynamicLocale',
    'pascalprecht.translate',
    'formly',
    'formlyMaterial',
    'pdf',
    'ui.select',
    'ngMaterial',
    'ngMdIcons'
])

.run(['$rootScope', 'Security',
    function($rootScope, Security) {
        $rootScope.isLoggedIn = function() {
            return Security.username && Security.password;
        }

        $rootScope.getUserName = function() {
            return Security.username;
        }
    }
])

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('blue-grey');
});