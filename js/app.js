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
    'ui.bootstrap',
    'dialogs',
    'pascalprecht.translate'
])