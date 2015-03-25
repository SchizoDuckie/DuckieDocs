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


        .state('document', {
            url: '/document/:id',
            resolve: {
                SidePanelState: showSidePanel,
                Document: function($stateParams) {
                    return CRUD.FindOne('Document', {
                        ID_Document: $stateParams.id
                    })
                }
            },
            views: {
                main: {
                    templateUrl: 'templates/document.html',
                    controller: 'DocumentCtrl',
                    controllerAs: 'vm'
                },
                sidePanel: {
                    templateUrl: 'templates/sidepanel/document.html',
                    controller: 'SidepanelDocumentCtrl',
                    controllerAs: 'vm'
                }
            }
        })

        .state('companies', {
            url: '/companies',
            resolve: {
                SidePanelState: hideSidePanel,
                Companies: function() {
                    return CRUD.Find('Company', {})
                }
            },
            views: {
                main: {
                    templateUrl: 'templates/companies.html',
                    controller: 'CompaniesCtrl',
                    controllerAs: 'vm'
                }
            }
        })

        .state('company', {
            url: '/company/:id',
            resolve: {
                SidePanelState: hideSidePanel,
                Company: function($stateParams) {
                    return CRUD.FindOne('Company', {
                        ID_Company: $stateParams.id
                    });
                },
                Documents: function($stateParams) {
                    return CRUD.Findl('Document', {
                        ID_Company: $stateParams.id
                    });
                }
            },
            views: {
                main: {
                    templateUrl: 'templates/company.html',
                    controller: 'CompanyCtrl',
                    controllerAs: 'vm'
                }
            }
        })

        .state('search', {
            url: '/search',
            resolve: {
                SidePanelState: hideSidePanel
            },
            views: {
                main: {
                    templateUrl: 'templates/search.html',
                    controller: 'SearchCtrl',
                    controllerAs: 'vm'
                }
            }
        })

        .state('upload', {
            url: '/upload',
            resolve: {
                SidePanelState: showSidePanel
            },
            views: {
                main: {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                },
                sidePanel: {
                    templateUrl: 'templates/upload.html',
                    controller: 'UploadCtrl',
                    controllerAs: 'upload'
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