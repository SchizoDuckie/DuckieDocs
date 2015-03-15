/**
 * Actionbar Controller
 */

DuckieDocs.controller('ActionBarCtrl', ["$rootScope", "$state", "$filter", "SidePanelState",
    function($rootScope, $state, $filter, SidePanelState) {

        this.hidePanels = function() {
            SidePanelState.hide();
        };

        this.contractSidePanel = function() {
            SidePanelState.show();
            SidePanelState.contract();
        };

        this.hideSidePanel = function() {
            SidePanelState.hide();
        };

        this.showSidePanel = function() {
            setTimeout(function() { // i have no idea why, but transitioning from serieslist to settings doesnt work otherwise.
                SidePanelState.show();
            }, 500)
        }

        this.expandSidePanel = function() {
            SidePanelState.expand();
        }

        this.go = function(state) {
            Array.prototype.map.call(document.querySelectorAll('#actionbar a'), function(el) {
                el.classList.remove('active');
            });
            var stateEl = document.querySelector('#actionbar_' + state);
            stateEl.classList.add('active');
            stateEl.classList.add('fastspin');
            setTimeout(function() {
                $state.go(state).then(function() {
                    setTimeout(function() {
                        stateEl.classList.remove('fastspin');
                    }, 500)
                })

            })
        }
    }
])