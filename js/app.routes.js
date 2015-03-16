/**
 * Routing configuration.
 */
DuckieDocs.config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {

        function showSidePanel(SidePanelState) {
            SidePanelState.show();
            return SidePanelState;
        }

        function expandSidePanel(SidePanelState) {
            SidePanelState.show();
            SidePanelState.expand();
            return SidePanelState;
        }

        function expandSidePanelIfOpen(SidePanelState) {
            if (SidePanelState.state.isShowing) {
                SidePanelState.expand();
            } else {
                SidePanelState.show();
            }
            return SidePanelState;
        }

        function hideSidePanel(SidePanelState) {
            SidePanelState.hide();
            return SidePanelState
        }

        // if the path doesn't match any of the urls you configured
        // otherwise will take care of routing the user to the specified url

        $stateProvider

        .state('login', {
            url: '/login',
            resolve: {
                SidePanelState: hideSidePanel
            },
            views: {
                main: {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'login'
                }
            }
        })


        .state('home', {
            url: '/home',
            resolve: {
                SidePanelState: hideSidePanel
            },
            views: {
                main: {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                }
            }
        })



        .state('settings', {
            url: '/settings',
            sticky: false,
            resolve: {
                SidePanelState: showSidePanel,
            },
            views: {
                sidePanel: {
                    templateUrl: 'templates/sidepanel/settings.html',
                }
            }
        })

        .state('settings.tab', {
            url: '/:tab',
            resolve: {
                SidePanelState: expandSidePanel,
            },
            views: {
                settingsTab: {
                    templateUrl: function($stateParams) {
                        return 'templates/settings/' + $stateParams.tab + '.html'
                    }
                }
            }
        })

        $urlRouterProvider.otherwise('/login');

    }
])