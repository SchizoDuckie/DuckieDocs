/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.11.2 - 2015-03-17T04:08:46.474Z
 * License: MIT
 */
! function() {
    "use strict";
    var e = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        COMMAND: 91,
        MAP: {
            91: "COMMAND",
            8: "BACKSPACE",
            9: "TAB",
            13: "ENTER",
            16: "SHIFT",
            17: "CTRL",
            18: "ALT",
            19: "PAUSEBREAK",
            20: "CAPSLOCK",
            27: "ESC",
            32: "SPACE",
            33: "PAGE_UP",
            34: "PAGE_DOWN",
            35: "END",
            36: "HOME",
            37: "LEFT",
            38: "UP",
            39: "RIGHT",
            40: "DOWN",
            43: "+",
            44: "PRINTSCREEN",
            45: "INSERT",
            46: "DELETE",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            59: ";",
            61: "=",
            65: "A",
            66: "B",
            67: "C",
            68: "D",
            69: "E",
            70: "F",
            71: "G",
            72: "H",
            73: "I",
            74: "J",
            75: "K",
            76: "L",
            77: "M",
            78: "N",
            79: "O",
            80: "P",
            81: "Q",
            82: "R",
            83: "S",
            84: "T",
            85: "U",
            86: "V",
            87: "W",
            88: "X",
            89: "Y",
            90: "Z",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "NUMLOCK",
            145: "SCROLLLOCK",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        },
        isControl: function(t) {
            var c = t.which;
            switch (c) {
                case e.COMMAND:
                case e.SHIFT:
                case e.CTRL:
                case e.ALT:
                    return !0
            }
            return t.metaKey ? !0 : !1
        },
        isFunctionKey: function(e) {
            return e = e.which ? e.which : e, e >= 112 && 123 >= e
        },
        isVerticalMovement: function(t) {
            return~ [e.UP, e.DOWN].indexOf(t)
        },
        isHorizontalMovement: function(t) {
            return~ [e.LEFT, e.RIGHT, e.BACKSPACE, e.DELETE].indexOf(t)
        }
    };
    void 0 === angular.element.prototype.querySelectorAll && (angular.element.prototype.querySelectorAll = function(e) {
        return angular.element(this[0].querySelectorAll(e))
    }), void 0 === angular.element.prototype.closest && (angular.element.prototype.closest = function(e) {
        for (var t = this[0], c = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector; t;) {
            if (c.bind(t)(e)) return t;
            t = t.parentElement
        }
        return !1
    });
    var t = 0,
        c = angular.module("ui.select", []).constant("uiSelectConfig", {
            theme: "bootstrap",
            searchEnabled: !0,
            sortable: !1,
            placeholder: "",
            refreshDelay: 1e3,
            closeOnSelect: !0,
            generateId: function() {
                return t++
            },
            appendToBody: !1
        }).service("uiSelectMinErr", function() {
            var e = angular.$$minErr("ui.select");
            return function() {
                var t = e.apply(this, arguments),
                    c = t.message.replace(new RegExp("\nhttp://errors.angularjs.org/.*"), "");
                return new Error(c)
            }
        }).directive("uisTranscludeAppend", function() {
            return {
                link: function(e, t, c, i, s) {
                    s(e, function(e) {
                        t.append(e)
                    })
                }
            }
        }).filter("highlight", function() {
            function e(e) {
                return e.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
            }
            return function(t, c) {
                return c && t ? t.replace(new RegExp(e(c), "gi"), '<span class="ui-select-highlight">$&</span>') : t
            }
        }).factory("uisOffset", ["$document", "$window",
            function(e, t) {
                return function(c) {
                    var i = c[0].getBoundingClientRect();
                    return {
                        width: i.width || c.prop("offsetWidth"),
                        height: i.height || c.prop("offsetHeight"),
                        top: i.top + (t.pageYOffset || e[0].documentElement.scrollTop),
                        left: i.left + (t.pageXOffset || e[0].documentElement.scrollLeft)
                    }
                }
            }
        ]);
    c.directive("uiSelectChoices", ["uiSelectConfig", "uisRepeatParser", "uiSelectMinErr", "$compile",
        function(e, t, c, i) {
            return {
                restrict: "EA",
                require: "^uiSelect",
                replace: !0,
                transclude: !0,
                templateUrl: function(t) {
                    var c = t.parent().attr("theme") || e.theme;
                    return c + "/choices.tpl.html"
                },
                compile: function(s, l) {
                    if (!l.repeat) throw c("repeat", "Expected 'repeat' expression.");
                    return function(s, l, n, a, r) {
                        var o = n.groupBy;
                        if (a.parseRepeatAttr(n.repeat, o), a.disableChoiceExpression = n.uiDisableChoice, a.onHighlightCallback = n.onHighlight, o) {
                            var u = l.querySelectorAll(".ui-select-choices-group");
                            if (1 !== u.length) throw c("rows", "Expected 1 .ui-select-choices-group but got '{0}'.", u.length);
                            u.attr("ng-repeat", t.getGroupNgRepeatExpression())
                        }
                        var d = l.querySelectorAll(".ui-select-choices-row");
                        if (1 !== d.length) throw c("rows", "Expected 1 .ui-select-choices-row but got '{0}'.", d.length);
                        d.attr("ng-repeat", t.getNgRepeatExpression(a.parserResult.itemName, "$select.items", a.parserResult.trackByExp, o)).attr("ng-if", "$select.open").attr("ng-mouseenter", "$select.setActiveItem(" + a.parserResult.itemName + ")").attr("ng-click", "$select.select(" + a.parserResult.itemName + ",false,$event)");
                        var p = l.querySelectorAll(".ui-select-choices-row-inner");
                        if (1 !== p.length) throw c("rows", "Expected 1 .ui-select-choices-row-inner but got '{0}'.", p.length);
                        p.attr("uis-transclude-append", ""), i(l, r)(s), s.$watch("$select.search", function(e) {
                            e && !a.open && a.multiple && a.activate(!1, !0), a.activeIndex = a.tagging.isActivated ? -1 : 0, a.refresh(n.refresh)
                        }), n.$observe("refreshDelay", function() {
                            var t = s.$eval(n.refreshDelay);
                            a.refreshDelay = void 0 !== t ? t : e.refreshDelay
                        })
                    }
                }
            }
        }
    ]), c.controller("uiSelectCtrl", ["$scope", "$element", "$timeout", "$filter", "uisRepeatParser", "uiSelectMinErr", "uiSelectConfig",
        function(t, c, i, s, l, n, a) {
            function r() {
                (d.resetSearchInput || void 0 === d.resetSearchInput && a.resetSearchInput) && (d.search = p, d.selected && d.items.length && !d.multiple && (d.activeIndex = d.items.indexOf(d.selected)))
            }

            function o(t) {
                var c = !0;
                switch (t) {
                    case e.DOWN:
                        !d.open && d.multiple ? d.activate(!1, !0) : d.activeIndex < d.items.length - 1 && d.activeIndex++;
                        break;
                    case e.UP:
                        !d.open && d.multiple ? d.activate(!1, !0) : (d.activeIndex > 0 || 0 === d.search.length && d.tagging.isActivated && d.activeIndex > -1) && d.activeIndex--;
                        break;
                    case e.TAB:
                        (!d.multiple || d.open) && d.select(d.items[d.activeIndex], !0);
                        break;
                    case e.ENTER:
                        d.open && d.activeIndex >= 0 ? d.select(d.items[d.activeIndex]) : d.activate(!1, !0);
                        break;
                    case e.ESC:
                        d.close();
                        break;
                    default:
                        c = !1
                }
                return c
            }

            function u() {
                var e = c.querySelectorAll(".ui-select-choices-content"),
                    t = e.querySelectorAll(".ui-select-choices-row");
                if (t.length < 1) throw n("choices", "Expected multiple .ui-select-choices-row but got '{0}'.", t.length);
                if (!(d.activeIndex < 0)) {
                    var i = t[d.activeIndex],
                        s = i.offsetTop + i.clientHeight - e[0].scrollTop,
                        l = e[0].offsetHeight;
                    s > l ? e[0].scrollTop += s - l : s < i.clientHeight && (d.isGrouped && 0 === d.activeIndex ? e[0].scrollTop = 0 : e[0].scrollTop -= i.clientHeight - s)
                }
            }
            var d = this,
                p = "";
            if (d.placeholder = a.placeholder, d.searchEnabled = a.searchEnabled, d.sortable = a.sortable, d.refreshDelay = a.refreshDelay, d.removeSelected = !1, d.closeOnSelect = !0, d.search = p, d.activeIndex = 0, d.items = [], d.open = !1, d.focus = !1, d.disabled = !1, d.selected = void 0, d.focusser = void 0, d.resetSearchInput = !0, d.multiple = void 0, d.disableChoiceExpression = void 0, d.tagging = {
                isActivated: !1,
                fct: void 0
            }, d.taggingTokens = {
                isActivated: !1,
                tokens: void 0
            }, d.lockChoiceExpression = void 0, d.clickTriggeredSelect = !1, d.$filter = s, d.searchInput = c.querySelectorAll("input.ui-select-search"), 1 !== d.searchInput.length) throw n("searchInput", "Expected 1 input.ui-select-search but got '{0}'.", d.searchInput.length);
            d.isEmpty = function() {
                return angular.isUndefined(d.selected) || null === d.selected || "" === d.selected
            }, d.activate = function(e, c) {
                d.disabled || d.open || (c || r(), t.$broadcast("uis:activate"), d.open = !0, d.activeIndex = d.activeIndex >= d.items.length ? 0 : d.activeIndex, -1 === d.activeIndex && d.taggingLabel !== !1 && (d.activeIndex = 0), i(function() {
                    d.search = e || d.search, d.searchInput[0].focus()
                }))
            }, d.findGroupByName = function(e) {
                return d.groups && d.groups.filter(function(t) {
                    return t.name === e
                })[0]
            }, d.parseRepeatAttr = function(e, c) {
                function i(e) {
                    d.groups = [], angular.forEach(e, function(e) {
                        var i = t.$eval(c),
                            s = angular.isFunction(i) ? i(e) : e[i],
                            l = d.findGroupByName(s);
                        l ? l.items.push(e) : d.groups.push({
                            name: s,
                            items: [e]
                        })
                    }), d.items = [], d.groups.forEach(function(e) {
                        d.items = d.items.concat(e.items)
                    })
                }

                function s(e) {
                    d.items = e
                }
                d.setItemsFn = c ? i : s, d.parserResult = l.parse(e), d.isGrouped = !!c, d.itemProperty = d.parserResult.itemName, d.refreshItems = function(e) {
                    e = e || d.parserResult.source(t);
                    var c = d.selected;
                    if (angular.isArray(c) && !c.length || !d.removeSelected) d.setItemsFn(e);
                    else if (void 0 !== e) {
                        var i = e.filter(function(e) {
                            return c.indexOf(e) < 0
                        });
                        d.setItemsFn(i)
                    }
                }, t.$watchCollection(d.parserResult.source, function(e) {
                    if (void 0 === e || null === e) d.items = [];
                    else {
                        if (!angular.isArray(e)) throw n("items", "Expected an array but got '{0}'.", e);
                        d.refreshItems(e), d.ngModel.$modelValue = null
                    }
                })
            };
            var h;
            d.refresh = function(e) {
                void 0 !== e && (h && i.cancel(h), h = i(function() {
                    t.$eval(e)
                }, d.refreshDelay))
            }, d.setActiveItem = function(e) {
                d.activeIndex = d.items.indexOf(e)
            }, d.isActive = function(e) {
                if (!d.open) return !1;
                var t = d.items.indexOf(e[d.itemProperty]),
                    c = t === d.activeIndex;
                return !c || 0 > t && d.taggingLabel !== !1 || 0 > t && d.taggingLabel === !1 ? !1 : (c && !angular.isUndefined(d.onHighlightCallback) && e.$eval(d.onHighlightCallback), c)
            }, d.isDisabled = function(e) {
                if (d.open) {
                    var t, c = d.items.indexOf(e[d.itemProperty]),
                        i = !1;
                    return c >= 0 && !angular.isUndefined(d.disableChoiceExpression) && (t = d.items[c], i = !!e.$eval(d.disableChoiceExpression), t._uiSelectChoiceDisabled = i), i
                }
            }, d.select = function(e, c, s) {
                if (void 0 === e || !e._uiSelectChoiceDisabled) {
                    if (!d.items && !d.search) return;
                    if (!e || !e._uiSelectChoiceDisabled) {
                        if (d.tagging.isActivated) {
                            if (d.taggingLabel === !1)
                                if (d.activeIndex < 0) {
                                    if (e = void 0 !== d.tagging.fct ? d.tagging.fct(d.search) : d.search, !e || angular.equals(d.items[0], e)) return
                                } else e = d.items[d.activeIndex];
                            else if (0 === d.activeIndex) {
                                if (void 0 === e) return;
                                if (void 0 !== d.tagging.fct && "string" == typeof e) {
                                    if (e = d.tagging.fct(d.search), !e) return
                                } else "string" == typeof e && (e = e.replace(d.taggingLabel, "").trim())
                            }
                            if (d.selected && angular.isArray(d.selected) && d.selected.filter(function(t) {
                                return angular.equals(t, e)
                            }).length > 0) return d.close(c), void 0
                        }
                        t.$broadcast("uis:select", e);
                        var l = {};
                        l[d.parserResult.itemName] = e, i(function() {
                            d.onSelectCallback(t, {
                                $item: e,
                                $model: d.parserResult.modelMapper(t, l)
                            })
                        }), d.closeOnSelect && d.close(c), s && "click" === s.type && (d.clickTriggeredSelect = !0)
                    }
                }
            }, d.close = function(e) {
                d.open && (d.ngModel && d.ngModel.$setTouched && d.ngModel.$setTouched(), r(), d.open = !1, t.$broadcast("uis:close", e))
            }, d.setFocus = function() {
                d.focus || d.focusInput[0].focus()
            }, d.clear = function(e) {
                d.select(void 0), e.stopPropagation(), d.focusser[0].focus()
            }, d.toggle = function(e) {
                d.open ? (d.close(), e.preventDefault(), e.stopPropagation()) : d.activate()
            }, d.isLocked = function(e, t) {
                var c, i = d.selected[t];
                return i && !angular.isUndefined(d.lockChoiceExpression) && (c = !!e.$eval(d.lockChoiceExpression), i._uiSelectChoiceLocked = c), c
            };
            var g = null;
            d.sizeSearchInput = function() {
                var e = d.searchInput[0],
                    c = d.searchInput.parent().parent()[0],
                    s = function() {
                        return c.clientWidth * !!e.offsetParent
                    },
                    l = function(t) {
                        if (0 === t) return !1;
                        var c = t - e.offsetLeft - 10;
                        return 50 > c && (c = t), d.searchInput.css("width", c + "px"), !0
                    };
                d.searchInput.css("width", "10px"), i(function() {
                    null !== g || l(s()) || (g = t.$watch(s, function(e) {
                        l(e) && (g(), g = null)
                    }))
                })
            }, d.searchInput.on("keydown", function(c) {
                var s = c.which;
                t.$apply(function() {
                    var t = !1;
                    if ((d.items.length > 0 || d.tagging.isActivated) && (o(s), d.taggingTokens.isActivated)) {
                        for (var l = 0; l < d.taggingTokens.tokens.length; l++) d.taggingTokens.tokens[l] === e.MAP[c.keyCode] && d.search.length > 0 && (t = !0);
                        t && i(function() {
                            d.searchInput.triggerHandler("tagged");
                            var t = d.search.replace(e.MAP[c.keyCode], "").trim();
                            d.tagging.fct && (t = d.tagging.fct(t)), t && d.select(t, !0)
                        })
                    }
                }), e.isVerticalMovement(s) && d.items.length > 0 && u()
            }), d.searchInput.on("paste", function(e) {
                var t = e.originalEvent.clipboardData.getData("text/plain");
                if (t && t.length > 0 && d.taggingTokens.isActivated && d.tagging.fct) {
                    var c = t.split(d.taggingTokens.tokens[0]);
                    c && c.length > 0 && (angular.forEach(c, function(e) {
                        var t = d.tagging.fct(e);
                        t && d.select(t, !0)
                    }), e.preventDefault(), e.stopPropagation())
                }
            }), d.searchInput.on("tagged", function() {
                i(function() {
                    r()
                })
            }), t.$on("$destroy", function() {
                d.searchInput.off("keyup keydown tagged blur paste")
            })
        }
    ]), c.directive("uiSelect", ["$document", "uiSelectConfig", "uiSelectMinErr", "uisOffset", "$compile", "$parse", "$timeout",
        function(e, t, c, i, s, l, n) {
            return {
                restrict: "EA",
                templateUrl: function(e, c) {
                    var i = c.theme || t.theme;
                    return i + (angular.isDefined(c.multiple) ? "/select-multiple.tpl.html" : "/select.tpl.html")
                },
                replace: !0,
                transclude: !0,
                require: ["uiSelect", "^ngModel"],
                scope: !0,
                controller: "uiSelectCtrl",
                controllerAs: "$select",
                compile: function(s, a) {
                    return angular.isDefined(a.multiple) ? s.append("<ui-select-multiple/>").removeAttr("multiple") : s.append("<ui-select-single/>"),
                        function(s, a, r, o, u) {
                            function d(e) {
                                if (g.open) {
                                    var t = !1;
                                    if (t = window.jQuery ? window.jQuery.contains(a[0], e.target) : a[0].contains(e.target), !t && !g.clickTriggeredSelect) {
                                        var c = ["input", "button", "textarea"],
                                            i = angular.element(e.target).scope(),
                                            l = i && i.$select && i.$select !== g;
                                        l || (l = ~c.indexOf(e.target.tagName.toLowerCase())), g.close(l), s.$digest()
                                    }
                                    g.clickTriggeredSelect = !1
                                }
                            }

                            function p() {
                                var t = i(a);
                                m = angular.element('<div class="ui-select-placeholder"></div>'), m[0].style.width = t.width + "px", m[0].style.height = t.height + "px", a.after(m), $ = a[0].style.width, e.find("body").append(a), a[0].style.position = "absolute", a[0].style.left = t.left + "px", a[0].style.top = t.top + "px", a[0].style.width = t.width + "px"
                            }

                            function h() {
                                null !== m && (m.replaceWith(a), m = null, a[0].style.position = "", a[0].style.left = "", a[0].style.top = "", a[0].style.width = $)
                            }
                            var g = o[0],
                                f = o[1];
                            g.generatedId = t.generateId(), g.baseTitle = r.title || "Select box", g.focusserTitle = g.baseTitle + " focus", g.focusserId = "focusser-" + g.generatedId, g.closeOnSelect = function() {
                                return angular.isDefined(r.closeOnSelect) ? l(r.closeOnSelect)() : t.closeOnSelect
                            }(), g.onSelectCallback = l(r.onSelect), g.onRemoveCallback = l(r.onRemove), g.ngModel = f, g.choiceGrouped = function(e) {
                                return g.isGrouped && e && e.name
                            }, r.tabindex && r.$observe("tabindex", function(e) {
                                g.focusInput.attr("tabindex", e), a.removeAttr("tabindex")
                            }), s.$watch("searchEnabled", function() {
                                var e = s.$eval(r.searchEnabled);
                                g.searchEnabled = void 0 !== e ? e : t.searchEnabled
                            }), s.$watch("sortable", function() {
                                var e = s.$eval(r.sortable);
                                g.sortable = void 0 !== e ? e : t.sortable
                            }), r.$observe("disabled", function() {
                                g.disabled = void 0 !== r.disabled ? r.disabled : !1
                            }), r.$observe("resetSearchInput", function() {
                                var e = s.$eval(r.resetSearchInput);
                                g.resetSearchInput = void 0 !== e ? e : !0
                            }), r.$observe("tagging", function() {
                                if (void 0 !== r.tagging) {
                                    var e = s.$eval(r.tagging);
                                    g.tagging = {
                                        isActivated: !0,
                                        fct: e !== !0 ? e : void 0
                                    }
                                } else g.tagging = {
                                    isActivated: !1,
                                    fct: void 0
                                }
                            }), r.$observe("taggingLabel", function() {
                                void 0 !== r.tagging && (g.taggingLabel = "false" === r.taggingLabel ? !1 : void 0 !== r.taggingLabel ? r.taggingLabel : "(new)")
                            }), r.$observe("taggingTokens", function() {
                                if (void 0 !== r.tagging) {
                                    var e = void 0 !== r.taggingTokens ? r.taggingTokens.split("|") : [",", "ENTER"];
                                    g.taggingTokens = {
                                        isActivated: !0,
                                        tokens: e
                                    }
                                }
                            }), angular.isDefined(r.autofocus) && n(function() {
                                g.setFocus()
                            }), angular.isDefined(r.focusOn) && s.$on(r.focusOn, function() {
                                n(function() {
                                    g.setFocus()
                                })
                            }), e.on("click", d), s.$on("$destroy", function() {
                                e.off("click", d)
                            }), u(s, function(e) {
                                var t = angular.element("<div>").append(e),
                                    i = t.querySelectorAll(".ui-select-match");
                                if (i.removeAttr("ui-select-match"), i.removeAttr("data-ui-select-match"), 1 !== i.length) throw c("transcluded", "Expected 1 .ui-select-match but got '{0}'.", i.length);
                                a.querySelectorAll(".ui-select-match").replaceWith(i);
                                var s = t.querySelectorAll(".ui-select-choices");
                                if (s.removeAttr("ui-select-choices"), s.removeAttr("data-ui-select-choices"), 1 !== s.length) throw c("transcluded", "Expected 1 .ui-select-choices but got '{0}'.", s.length);
                                a.querySelectorAll(".ui-select-choices").replaceWith(s)
                            });
                            var v = s.$eval(r.appendToBody);
                            (void 0 !== v ? v : t.appendToBody) && (s.$watch("$select.open", function(e) {
                                e ? p() : h()
                            }), s.$on("$destroy", function() {
                                h()
                            }));
                            var m = null,
                                $ = ""
                        }
                }
            }
        }
    ]), c.directive("uiSelectMatch", ["uiSelectConfig",
        function(e) {
            return {
                restrict: "EA",
                require: "^uiSelect",
                replace: !0,
                transclude: !0,
                templateUrl: function(t) {
                    var c = t.parent().attr("theme") || e.theme,
                        i = t.parent().attr("multiple");
                    return c + (i ? "/match-multiple.tpl.html" : "/match.tpl.html")
                },
                link: function(t, c, i, s) {
                    function l(e) {
                        s.allowClear = angular.isDefined(e) ? "" === e ? !0 : "true" === e.toLowerCase() : !1
                    }
                    s.lockChoiceExpression = i.uiLockChoice, i.$observe("placeholder", function(t) {
                        s.placeholder = void 0 !== t ? t : e.placeholder
                    }), i.$observe("allowClear", l), l(i.allowClear), s.multiple && s.sizeSearchInput()
                }
            }
        }
    ]), c.directive("uiSelectMultiple", ["uiSelectMinErr", "$timeout",
        function(t, c) {
            return {
                restrict: "EA",
                require: ["^uiSelect", "^ngModel"],
                controller: ["$scope", "$timeout",
                    function(e, t) {
                        var c, i = this,
                            s = e.$select;
                        e.$evalAsync(function() {
                            c = e.ngModel
                        }), i.activeMatchIndex = -1, i.updateModel = function() {
                            c.$setViewValue(Date.now()), i.refreshComponent()
                        }, i.refreshComponent = function() {
                            s.refreshItems(), s.sizeSearchInput()
                        }, i.removeChoice = function(c) {
                            var l = s.selected[c];
                            if (!l._uiSelectChoiceLocked) {
                                var n = {};
                                n[s.parserResult.itemName] = l, s.selected.splice(c, 1), i.activeMatchIndex = -1, s.sizeSearchInput(), t(function() {
                                    s.onRemoveCallback(e, {
                                        $item: l,
                                        $model: s.parserResult.modelMapper(e, n)
                                    })
                                }), i.updateModel()
                            }
                        }, i.getPlaceholder = function() {
                            return s.selected.length ? void 0 : s.placeholder
                        }
                    }
                ],
                controllerAs: "$selectMultiple",
                link: function(i, s, l, n) {
                    function a(e) {
                        return angular.isNumber(e.selectionStart) ? e.selectionStart : e.value.length
                    }

                    function r(t) {
                        function c() {
                            switch (t) {
                                case e.LEFT:
                                    return~ h.activeMatchIndex ? u : n;
                                case e.RIGHT:
                                    return~ h.activeMatchIndex && r !== n ? o : (d.activate(), !1);
                                case e.BACKSPACE:
                                    return~ h.activeMatchIndex ? (h.removeChoice(r), u) : n;
                                case e.DELETE:
                                    return~ h.activeMatchIndex ? (h.removeChoice(h.activeMatchIndex), r) : !1
                            }
                        }
                        var i = a(d.searchInput[0]),
                            s = d.selected.length,
                            l = 0,
                            n = s - 1,
                            r = h.activeMatchIndex,
                            o = h.activeMatchIndex + 1,
                            u = h.activeMatchIndex - 1,
                            p = r;
                        return i > 0 || d.search.length && t == e.RIGHT ? !1 : (d.close(), p = c(), h.activeMatchIndex = d.selected.length && p !== !1 ? Math.min(n, Math.max(l, p)) : -1, !0)
                    }

                    function o(e) {
                        if (void 0 === e || void 0 === d.search) return !1;
                        var t = e.filter(function(e) {
                            return void 0 === d.search.toUpperCase() || void 0 === e ? !1 : e.toUpperCase() === d.search.toUpperCase()
                        }).length > 0;
                        return t
                    }

                    function u(e, t) {
                        var c = -1;
                        if (angular.isArray(e))
                            for (var i = angular.copy(e), s = 0; s < i.length; s++)
                                if (void 0 === d.tagging.fct) i[s] + " " + d.taggingLabel === t && (c = s);
                                else {
                                    var l = i[s];
                                    l.isTag = !0, angular.equals(l, t) && (c = s)
                                }
                        return c
                    }
                    var d = n[0],
                        p = i.ngModel = n[1],
                        h = i.$selectMultiple;
                    d.multiple = !0, d.removeSelected = !0, d.focusInput = d.searchInput, p.$parsers.unshift(function() {
                        for (var e, t = {}, c = [], s = d.selected.length - 1; s >= 0; s--) t = {}, t[d.parserResult.itemName] = d.selected[s], e = d.parserResult.modelMapper(i, t), c.unshift(e);
                        return c
                    }), p.$formatters.unshift(function(e) {
                        var t, c = d.parserResult.source(i, {
                                $select: {
                                    search: ""
                                }
                            }),
                            s = {};
                        if (!c) return e;
                        var l = [],
                            n = function(e, c) {
                                if (e && e.length) {
                                    for (var n = e.length - 1; n >= 0; n--) {
                                        if (s[d.parserResult.itemName] = e[n], t = d.parserResult.modelMapper(i, s), d.parserResult.trackByExp) {
                                            var a = /\.(.+)/.exec(d.parserResult.trackByExp);
                                            if (a.length > 0 && t[a[1]] == c[a[1]]) return l.unshift(e[n]), !0
                                        }
                                        if (angular.equals(t, c)) return l.unshift(e[n]), !0
                                    }
                                    return !1
                                }
                            };
                        if (!e) return l;
                        for (var a = e.length - 1; a >= 0; a--) n(d.selected, e[a]) || n(c, e[a]) || l.unshift(e[a]);
                        return l
                    }), i.$watchCollection(function() {
                        return p.$modelValue
                    }, function(e, t) {
                        t != e && (p.$modelValue = null, h.refreshComponent())
                    }), p.$render = function() {
                        if (!angular.isArray(p.$viewValue)) {
                            if (!angular.isUndefined(p.$viewValue) && null !== p.$viewValue) throw t("multiarr", "Expected model value to be array but got '{0}'", p.$viewValue);
                            d.selected = []
                        }
                        d.selected = p.$viewValue, i.$evalAsync()
                    }, i.$on("uis:select", function(e, t) {
                        d.selected.push(t), h.updateModel()
                    }), i.$on("uis:activate", function() {
                        h.activeMatchIndex = -1
                    }), i.$watch("$select.disabled", function(e, t) {
                        t && !e && d.sizeSearchInput()
                    }), d.searchInput.on("keydown", function(t) {
                        var c = t.which;
                        i.$apply(function() {
                            var i = !1;
                            e.isHorizontalMovement(c) && (i = r(c)), i && c != e.TAB && (t.preventDefault(), t.stopPropagation())
                        })
                    }), d.searchInput.on("keyup", function(t) {
                        if (e.isVerticalMovement(t.which) || i.$evalAsync(function() {
                            d.activeIndex = d.taggingLabel === !1 ? -1 : 0
                        }), d.tagging.isActivated && d.search.length > 0) {
                            if (t.which === e.TAB || e.isControl(t) || e.isFunctionKey(t) || t.which === e.ESC || e.isVerticalMovement(t.which)) return;
                            if (d.activeIndex = d.taggingLabel === !1 ? -1 : 0, d.taggingLabel === !1) return;
                            var c, s, l, n, a = angular.copy(d.items),
                                r = angular.copy(d.items),
                                p = !1,
                                h = -1;
                            if (void 0 !== d.tagging.fct) {
                                if (l = d.$filter("filter")(a, {
                                    isTag: !0
                                }), l.length > 0 && (n = l[0]), a.length > 0 && n && (p = !0, a = a.slice(1, a.length), r = r.slice(1, r.length)), c = d.tagging.fct(d.search), c.isTag = !0, r.filter(function(e) {
                                    return angular.equals(e, d.tagging.fct(d.search))
                                }).length > 0) return;
                                c.isTag = !0
                            } else {
                                if (l = d.$filter("filter")(a, function(e) {
                                    return e.match(d.taggingLabel)
                                }), l.length > 0 && (n = l[0]), s = a[0], void 0 !== s && a.length > 0 && n && (p = !0, a = a.slice(1, a.length), r = r.slice(1, r.length)), c = d.search + " " + d.taggingLabel, u(d.selected, d.search) > -1) return;
                                if (o(r.concat(d.selected))) return p && (a = r, i.$evalAsync(function() {
                                    d.activeIndex = 0, d.items = a
                                })), void 0;
                                if (o(r)) return p && (d.items = r.slice(1, r.length)), void 0
                            }
                            p && (h = u(d.selected, c)), h > -1 ? a = a.slice(h + 1, a.length - 1) : (a = [], a.push(c), a = a.concat(r)), i.$evalAsync(function() {
                                d.activeIndex = 0, d.items = a
                            })
                        }
                    }), d.searchInput.on("blur", function() {
                        c(function() {
                            h.activeMatchIndex = -1
                        })
                    })
                }
            }
        }
    ]), c.directive("uiSelectSingle", ["$timeout", "$compile",
        function(t, c) {
            return {
                restrict: "EA",
                require: ["^uiSelect", "^ngModel"],
                link: function(i, s, l, n) {
                    var a = n[0],
                        r = n[1];
                    r.$parsers.unshift(function(e) {
                        var t, c = {};
                        return c[a.parserResult.itemName] = e, t = a.parserResult.modelMapper(i, c)
                    }), r.$formatters.unshift(function(e) {
                        var t, c = a.parserResult.source(i, {
                                $select: {
                                    search: ""
                                }
                            }),
                            s = {};
                        if (c) {
                            var l = function(c) {
                                return s[a.parserResult.itemName] = c, t = a.parserResult.modelMapper(i, s), t == e
                            };
                            if (a.selected && l(a.selected)) return a.selected;
                            for (var n = c.length - 1; n >= 0; n--)
                                if (l(c[n])) return c[n]
                        }
                        return e
                    }), i.$watch("$select.selected", function(e) {
                        r.$viewValue !== e && r.$setViewValue(e)
                    }), r.$render = function() {
                        a.selected = r.$viewValue
                    }, i.$on("uis:select", function(e, t) {
                        a.selected = t
                    }), i.$on("uis:close", function(e, c) {
                        t(function() {
                            a.focusser.prop("disabled", !1), c || a.focusser[0].focus()
                        }, 0, !1)
                    }), i.$on("uis:activate", function() {
                        o.prop("disabled", !0)
                    });
                    var o = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");
                    c(o)(i), a.focusser = o, a.focusInput = o, s.parent().append(o), o.bind("focus", function() {
                        i.$evalAsync(function() {
                            a.focus = !0
                        })
                    }), o.bind("blur", function() {
                        i.$evalAsync(function() {
                            a.focus = !1
                        })
                    }), o.bind("keydown", function(t) {
                        return t.which === e.BACKSPACE ? (t.preventDefault(), t.stopPropagation(), a.select(void 0), i.$apply(), void 0) : (t.which === e.TAB || e.isControl(t) || e.isFunctionKey(t) || t.which === e.ESC || ((t.which == e.DOWN || t.which == e.UP || t.which == e.ENTER || t.which == e.SPACE) && (t.preventDefault(), t.stopPropagation(), a.activate()), i.$digest()), void 0)
                    }), o.bind("keyup input", function(t) {
                        t.which === e.TAB || e.isControl(t) || e.isFunctionKey(t) || t.which === e.ESC || t.which == e.ENTER || t.which === e.BACKSPACE || (a.activate(o.val()), o.val(""), i.$digest())
                    })
                }
            }
        }
    ]), c.directive("uiSelectSort", ["$timeout", "uiSelectConfig", "uiSelectMinErr",
        function(e, t, c) {
            return {
                require: "^uiSelect",
                link: function(t, i, s, l) {
                    if (null === t[s.uiSelectSort]) throw c("sort", "Expected a list to sort");
                    var n = angular.extend({
                            axis: "horizontal"
                        }, t.$eval(s.uiSelectSortOptions)),
                        a = n.axis,
                        r = "dragging",
                        o = "dropping",
                        u = "dropping-before",
                        d = "dropping-after";
                    t.$watch(function() {
                        return l.sortable
                    }, function(e) {
                        e ? i.attr("draggable", !0) : i.removeAttr("draggable")
                    }), i.on("dragstart", function(e) {
                        i.addClass(r), (e.dataTransfer || e.originalEvent.dataTransfer).setData("text/plain", t.$index)
                    }), i.on("dragend", function() {
                        i.removeClass(r)
                    });
                    var p, h = function(e, t) {
                            this.splice(t, 0, this.splice(e, 1)[0])
                        },
                        g = function(e) {
                            e.preventDefault();
                            var t = "vertical" === a ? e.offsetY || e.layerY || (e.originalEvent ? e.originalEvent.offsetY : 0) : e.offsetX || e.layerX || (e.originalEvent ? e.originalEvent.offsetX : 0);
                            t < this["vertical" === a ? "offsetHeight" : "offsetWidth"] / 2 ? (i.removeClass(d), i.addClass(u)) : (i.removeClass(u), i.addClass(d))
                        },
                        f = function(t) {
                            t.preventDefault();
                            var c = parseInt((t.dataTransfer || t.originalEvent.dataTransfer).getData("text/plain"), 10);
                            e.cancel(p), p = e(function() {
                                v(c)
                            }, 20)
                        },
                        v = function(e) {
                            var c = t.$eval(s.uiSelectSort),
                                l = c[e],
                                n = null;
                            n = i.hasClass(u) ? e < t.$index ? t.$index - 1 : t.$index : e < t.$index ? t.$index : t.$index + 1, h.apply(c, [e, n]), t.$apply(function() {
                                t.$emit("uiSelectSort:change", {
                                    array: c,
                                    item: l,
                                    from: e,
                                    to: n
                                })
                            }), i.removeClass(o), i.removeClass(u), i.removeClass(d), i.off("drop", f)
                        };
                    i.on("dragenter", function() {
                        i.hasClass(r) || (i.addClass(o), i.on("dragover", g), i.on("drop", f))
                    }), i.on("dragleave", function(e) {
                        e.target == i && (i.removeClass(o), i.removeClass(u), i.removeClass(d), i.off("dragover", g), i.off("drop", f))
                    })
                }
            }
        }
    ]), c.service("uisRepeatParser", ["uiSelectMinErr", "$parse",
        function(e, t) {
            var c = this;
            c.parse = function(c) {
                var i = c.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                if (!i) throw e("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", c);
                return {
                    itemName: i[2],
                    source: t(i[3]),
                    trackByExp: i[4],
                    modelMapper: t(i[1] || i[2])
                }
            }, c.getGroupNgRepeatExpression = function() {
                return "$group in $select.groups"
            }, c.getNgRepeatExpression = function(e, t, c, i) {
                var s = e + " in " + (i ? "$group.items" : t);
                return c && (s += " track by " + c), s
            }
        }
    ])
}(), angular.module("ui.select").run(["$templateCache",
    function(e) {
        e.put("bootstrap/choices.tpl.html", '<ul class="ui-select-choices ui-select-choices-content dropdown-menu" role="listbox" ng-show="$select.items.length > 0"><li class="ui-select-choices-group" id="ui-select-choices-{{ $select.generatedId }}"><div class="divider" ng-show="$select.isGrouped && $index > 0"></div><div ng-show="$select.isGrouped" class="ui-select-choices-group-label dropdown-header" ng-bind="$group.name"></div><div id="ui-select-choices-row-{{ $select.generatedId }}-{{$index}}" class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}" role="option"><a href="javascript:void(0)" class="ui-select-choices-row-inner"></a></div></li></ul>'), e.put("bootstrap/match-multiple.tpl.html", '<span class="ui-select-match"><span ng-repeat="$item in $select.selected"><span class="ui-select-match-item btn btn-default btn-xs" tabindex="-1" type="button" ng-disabled="$select.disabled" ng-click="$selectMultiple.activeMatchIndex = $index;" ng-class="{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}" ui-select-sort="$select.selected"><span class="close ui-select-match-close" ng-hide="$select.disabled" ng-click="$selectMultiple.removeChoice($index)">&nbsp;&times;</span> <span uis-transclude-append=""></span></span></span></span>'), e.put("bootstrap/match.tpl.html", '<div class="ui-select-match" ng-hide="$select.open" ng-disabled="$select.disabled" ng-class="{\'btn-default-focus\':$select.focus}"><span tabindex="-1" class="btn btn-default form-control ui-select-toggle" aria-label="{{ $select.baseTitle }} activate" ng-disabled="$select.disabled" ng-click="$select.activate()" style="outline: 0;"><span ng-show="$select.isEmpty()" class="ui-select-placeholder text-muted">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" class="ui-select-match-text pull-left" ng-class="{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}" ng-transclude=""></span> <i class="caret pull-right" ng-click="$select.toggle($event)"></i> <a ng-show="$select.allowClear && !$select.isEmpty()" aria-label="{{ $select.baseTitle }} clear" style="margin-right: 10px" ng-click="$select.clear($event)" class="btn btn-xs btn-link pull-right"><i class="glyphicon glyphicon-remove" aria-hidden="true"></i></a></span></div>'), e.put("bootstrap/select-multiple.tpl.html", '<div class="ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control" ng-class="{open: $select.open}"><div><div class="ui-select-match"></div><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="ui-select-search input-xs" placeholder="{{$selectMultiple.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-click="$select.activate()" ng-model="$select.search" role="combobox" aria-label="{{ $select.baseTitle }}" ondrop="return false;"></div><div class="ui-select-choices"></div></div>'), e.put("bootstrap/select.tpl.html", '<div class="ui-select-container ui-select-bootstrap dropdown" ng-class="{open: $select.open}"><div class="ui-select-match"></div><input type="text" autocomplete="off" tabindex="-1" aria-expanded="true" aria-label="{{ $select.baseTitle }}" aria-owns="ui-select-choices-{{ $select.generatedId }}" aria-activedescendant="ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}" class="form-control ui-select-search" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-show="$select.searchEnabled && $select.open"><div class="ui-select-choices"></div></div>'), e.put("select2/choices.tpl.html", '<ul class="ui-select-choices ui-select-choices-content select2-results"><li class="ui-select-choices-group" ng-class="{\'select2-result-with-children\': $select.choiceGrouped($group) }"><div ng-show="$select.choiceGrouped($group)" class="ui-select-choices-group-label select2-result-label" ng-bind="$group.name"></div><ul role="listbox" id="ui-select-choices-{{ $select.generatedId }}" ng-class="{\'select2-result-sub\': $select.choiceGrouped($group), \'select2-result-single\': !$select.choiceGrouped($group) }"><li role="option" id="ui-select-choices-row-{{ $select.generatedId }}-{{$index}}" class="ui-select-choices-row" ng-class="{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}"><div class="select2-result-label ui-select-choices-row-inner"></div></li></ul></li></ul>'), e.put("select2/match-multiple.tpl.html", '<span class="ui-select-match"><li class="ui-select-match-item select2-search-choice" ng-repeat="$item in $select.selected" ng-class="{\'select2-search-choice-focus\':$selectMultiple.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}" ui-select-sort="$select.selected"><span uis-transclude-append=""></span> <a href="javascript:;" class="ui-select-match-close select2-search-choice-close" ng-click="$selectMultiple.removeChoice($index)" tabindex="-1"></a></li></span>'), e.put("select2/match.tpl.html", '<a class="select2-choice ui-select-match" ng-class="{\'select2-default\': $select.isEmpty()}" ng-click="$select.toggle($event)" aria-label="{{ $select.baseTitle }} select"><span ng-show="$select.isEmpty()" class="select2-chosen">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" class="select2-chosen" ng-transclude=""></span> <abbr ng-if="$select.allowClear && !$select.isEmpty()" class="select2-search-choice-close" ng-click="$select.clear($event)"></abbr> <span class="select2-arrow ui-select-toggle"><b></b></span></a>'), e.put("select2/select-multiple.tpl.html", '<div class="ui-select-container ui-select-multiple select2 select2-container select2-container-multi" ng-class="{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled}"><ul class="select2-choices"><span class="ui-select-match"></span><li class="select2-search-field"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="combobox" aria-expanded="true" aria-owns="ui-select-choices-{{ $select.generatedId }}" aria-label="{{ $select.baseTitle }}" aria-activedescendant="ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}" class="select2-input ui-select-search" placeholder="{{$selectMultiple.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-model="$select.search" ng-click="$select.activate()" style="width: 34px;" ondrop="return false;"></li></ul><div class="select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open}"><div class="ui-select-choices"></div></div></div>'), e.put("select2/select.tpl.html", '<div class="ui-select-container select2 select2-container" ng-class="{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled, \'select2-container-active\': $select.focus, \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}"><div class="ui-select-match"></div><div class="select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open}"><div class="select2-search" ng-show="$select.searchEnabled"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="combobox" aria-expanded="true" aria-owns="ui-select-choices-{{ $select.generatedId }}" aria-label="{{ $select.baseTitle }}" aria-activedescendant="ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}" class="ui-select-search select2-input" ng-model="$select.search"></div><div class="ui-select-choices"></div></div></div>'), e.put("selectize/choices.tpl.html", '<div ng-show="$select.open" class="ui-select-choices selectize-dropdown single"><div class="ui-select-choices-content selectize-dropdown-content"><div class="ui-select-choices-group optgroup" role="listbox"><div ng-show="$select.isGrouped" class="ui-select-choices-group-label optgroup-header" ng-bind="$group.name"></div><div role="option" class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}"><div class="option ui-select-choices-row-inner" data-selectable=""></div></div></div></div></div>'), e.put("selectize/match.tpl.html", '<div ng-hide="($select.open || $select.isEmpty())" class="ui-select-match" ng-transclude=""></div>'), e.put("selectize/select.tpl.html", '<div class="ui-select-container selectize-control single" ng-class="{\'open\': $select.open}"><div class="selectize-input" ng-class="{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}" ng-click="$select.activate()"><div class="ui-select-match"></div><input type="text" autocomplete="off" tabindex="-1" class="ui-select-search ui-select-toggle" ng-click="$select.toggle($event)" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-hide="!$select.searchEnabled || ($select.selected && !$select.open)" ng-disabled="$select.disabled" aria-label="{{ $select.baseTitle }}"></div><div class="ui-select-choices"></div></div>')
    }
]);