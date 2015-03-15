DuckieDocs
/**
 * The Settings Service stores user preferences and provides defaults.
 * Storage is in localStorage. values get serialized on save and deserialized on initialization.
 *
 * Shorthands to the get and set functions are provided in $rootScope by the getSetting and setSetting functions
 */
.factory('SettingsService', ["$injector", "$rootScope",
    function($injector, $rootScope) {
        var service = {
            settings: {},
            defaults: {

            },
            /**
             * Read a setting key and return either the stored value or the default
             * @param  string key to read
             * @return mixed value value of the setting
             */
            get: function(key) {

                return ((key in service.settings) ? service.settings[key] : (key in service.defaults) ? service.defaults[key] : false);
            },
            /**
             * Store a value in the settings object and persist the changes automatically.
             * @param string key key to store
             * @param mixed value to store
             */
            set: function(key, value) {
                service.settings[key] = value;

                service.persist();
            },
            /**
             * Serialize the data and persist it in localStorage
             */
            persist: function() {
                localStorage.setItem('userPreferences', angular.toJson(service.settings, true));
            },
            /**
             * Fetch stored series from sqlite and store them in service.favorites
             */
            restore: function() {
                if (!localStorage.getItem('userPreferences')) {
                    service.settings = service.defaults;
                } else {
                    service.settings = angular.fromJson(localStorage.getItem('userPreferences'));
                }
            },
            /*
             * Change the UI language and locale to use for translations tmhDynamicLocale
             * Todo: clean this up.
             */
            changeLanguage: function(langKey) {
                langKey = angular.lowercase(langKey) || 'en_us';
                var locale = langKey;
                switch (langKey) {
                    case 'en_au':
                    case 'en_ca':
                    case 'en_gb':
                    case 'en_nz':
                        langKey = 'en_uk';
                        break;
                    case 'de':
                        langKey = 'de_de';
                        break;
                    case 'en':
                        langKey = 'en_us';
                        break;
                    case 'es':
                        langKey = 'es_es';
                        break;
                    case 'fr':
                        langKey = 'fr_fr';
                        break;
                    case 'it':
                        langKey = 'it_it';
                        break;
                    case 'ja':
                        langKey = 'ja_jp';
                        break;
                    case 'ko':
                        langKey = 'ko_kr';
                        break;
                    case 'nl':
                        langKey = 'nl_nl';
                        break;
                    case 'pt':
                    case 'pt_br':
                        langKey = 'pt_pt';
                        break;
                    case 'es_419':
                        langKey = 'es_es';
                        break;
                    case 'ru':
                        langKey = 'ru_ru';
                        break;
                    case 'sv':
                        langKey = 'sv_se';
                        break;
                    case 'zh':
                        langKey = 'zh_cn';
                        break;
                }
                service.set('application.language', langKey);
                service.set('application.locale', locale);
                $injector.get('$translate').use(langKey); // get these via the injector so that we don't have to use these dependencies hardcoded.
                $injector.get('tmhDynamicLocale').set(locale); // the SettingsService is also required in the background page and we don't need $translate there
                //console.info("Active Language", langKey, "; Active Locale", locale);
            }
        };
        service.restore();
        return service;
    }
])

/**
 * rootScope shorthand helper functions.
 */
.run(function($rootScope, SettingsService) {

    $rootScope.getSetting = function(key) {
        return SettingsService.get(key);
    };

    $rootScope.setSetting = function(key, value) {
        return SettingsService.set(key, value);
    };

    $rootScope.enableSetting = function(key) {
        SettingsService.set(key, true);
    };

    $rootScope.disableSetting = function(key) {
        SettingsService.set(key, false);
    };

})