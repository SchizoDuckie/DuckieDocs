if (!CRUD) var CRUD = {
    RELATION_SINGLE: 1,
    RELATION_FOREIGN: 2,
    RELATION_MANY: 3,
    RELATION_CUSTOM: 4,
    DEBUG: false,
    stats: {
        writesQueued: 0,
        writesExecuted: 0
    },
    log: function() {
        if (CRUD.DEBUG) {
            console.log.apply(console, arguments);
        }
    }
};


/** 
 * The main object proxy that returns either a fresh entity object or a promise that loads data, when you pass the primary key value to search for.
 *
 * The main idea behind this is that you can do:
 * var Project = CRUD.define(dbSetup, methods)
 * var p = new Project(); // now you can use get/set on p, after which you can use p.Persist().then(function() {} );
 * new Project(20).then(function(project) { project with id 20 has been fetched from adapter, use it here. })
 */


CRUD.EntityManager = (new function() {

    this.entities = {};
    this.constructors = {};
    this.cache = {};
    this.connectionAdapter = false;

    this.defaultSetup = {
        className: 'CRUD.Entity',
        ID: false,
        table: false,
        primary: false,
        fields: [],
        indexes: [],
        autoSerialize: [],
        defaultValues: {},
        adapter: false,
        orderProperty: false,
        orderDirection: false,
        relations: {},
        connectors: {},
        createStatement: false,
        keys: []
    };

    /**
     * Register a new entity into the entity manager, which will manage it's properties, relations, and data.
     */
    this.registerEntity = function(className, dbSetup, methods) {
        CRUD.log("Register entity", dbSetup, className);
        if (!(className in this.entities)) {
            this.entities[className] = Object.clone(this.defaultSetup);
        }
        for (var prop in dbSetup) {
            this.entities[className][prop] = dbSetup[prop];
        }
        return this.constructors[className] = function(ID) {
            return ID ? new CRUD.Entity(className, methods).primaryKeyInit(ID) : new CRUD.Entity(className, methods);
        };
    };

    this.getPrimary = function(className) {
        if (!className || !this.entities[className]) {
            throw "Invalid className passed to CRUD.EntityManager.getPrimary : " + className;
        }
        return this.entities[className].primary;
    };

    this.getDefaultValues = function(className) {
        if (!className || !this.entities[className]) {
            throw "Invalid className passed to CRUD.EntityManager.getDefaultValues : " + className;
        }
        return this.entities[className].defaultValues;
    };

    /** 
     * Set and initialize the connection adapter.
     */
    this.setAdapter = function(adapter) {
        this.connectionAdapter = adapter;
        return this.connectionAdapter.Init();
    };

    this.getAdapter = function() {
        return this.connectionAdapter;
    };

    this.hasField = function(className, property) {
        return (this.entities[className] && this.entities[className].fields.indexOf(property) > -1)
    };

    this.getFields = function(className) {
        return this.entities[className].fields;
    };
    this.hasRelation = function(className, related) {
        return ((related in this.entities[className].relations));
    };

    return this;

}());

CRUD.define = function(properties, methods) {
    return CRUD.EntityManager.registerEntity(properties.className, properties, methods);

};

CRUD.setAdapter = function(adapter) {
    return CRUD.EntityManager.setAdapter(adapter);
};


/**
 * CRUD.Find is probably the function that you'll use most to query things:
 *
 * Syntax:
 * CRUD.Find(Product, { Catalog: { ID: 1 }} ).then( function(products) {
 *		for(var i=0; i< products.length; i++) {
 *			$$(".body")[0].adopt(products[i].display());
 *		}
 *	}, function(error) { CRUD.log("ERROR IN CRUD.FIND for catalog 1 ", error); });
 */
CRUD.Find = function(obj, filters, options) {
    var type = false;

    if (obj.toString() == 'CRUD') {
        type = obj.getType();

        if (obj.getID() !== false) {
            CRUD.log("Object has an ID! ", ID, type);
            filters.ID = obj.getID();
            filters.type = filters
        }
    } else {
        if (typeof obj == "function") {
            try {
                obj = new obj();
                type = obj.className;
            } catch (E) {}
        } else if (typeof obj == "string") {
            type = obj;
        }

    }
    if (!(type in CRUD.EntityManager.entities)) {
        CRUD.log("CRUD.Find cannot search for non-CRUD objects like " + obj + "!", filters, options);
        return false;
    }

    var extras = [];
    options = options || {};
    if (options && options.limit) {
        extras.limit = (options.start || 0) + "," + options.limit;
        delete options.limit;
    }
    if (options && options.order) {
        extras.order = options.order;
        delete options.order;
    }
    if (options && options.group) {
        extras.group = options.group;
        delete options.group;
    }
    var justthese = options.justthese || [];
    return CRUD.EntityManager.getAdapter().Find(type, filters, extras, justthese, options).then(function(results) {
        return results.map(function(el) {
            if (!(type in CRUD.EntityManager.cache)) {
                CRUD.EntityManager.cache[type] = {};
            }
            var idProp = CRUD.EntityManager.entities[type].primary;
            if (!(el[idProp] in CRUD.EntityManager.cache[type])) {
                CRUD.EntityManager.cache[type][el[idProp]] = new CRUD.EntityManager.constructors[type]();
            }
            return CRUD.EntityManager.cache[type][el[idProp]].importValues(el);
        });
    })
};

CRUD.FindCount = function(obj, filters, options) {
    var type = false;

    if (obj.toString() == 'CRUD') {
        type = obj.getType();

        if (obj.getID() !== false) {
            CRUD.log("Object has an ID! ", ID, type);
            filters.ID = obj.getID();
            filters.type = filters
        }
    } else {
        if (typeof obj == "function") {
            try {
                obj = new obj();
                type = obj.className;
            } catch (E) {}
        } else if (typeof obj == "string") {
            type = obj;
        }

    }
    if (!(type in CRUD.EntityManager.entities)) {
        CRUD.log("CRUD.Find cannot search for non-CRUD objects like " + obj + "!", filters, options);
        return false;
    }

    var extras = [];
    options = options || {};
    if (options && options.limit) {
        extras.limit = (options.start || 0) + "," + options.limit;
        delete options.limit;
    }
    if (options && options.order) {
        extras.order = options.order;
        delete options.order;
    }
    if (options && options.group) {
        extras.group = options.group;
        delete options.group;
    }
    var justthese = options.justthese || [];
    return CRUD.EntityManager.getAdapter().FindCount(type, filters, extras, justthese, options);
}

/** 
 * Uses CRUD.find with a limit 0,1 and returns the first result.
 * @returns Promise
 */
CRUD.FindOne = function(obj, filters, options) {
    options = options || {};
    options.limit = 1;
    return this.Find(obj, filters, options).then(function(result) {
        return result[0];
    });

};


CRUD.fromCache = function(obj, values) {
    try {
        obj = (typeof obj == 'function') ? new obj() : new CRUD.EntityManager.constructors[obj]();
        type = (obj && obj.toString() == 'CRUD') ? obj.getType() : false;
    } catch (E) {
        CRUD.log("CRUD.fromCache cannot create for non-CRUD objects like " + obj + "! \n" + E);
        return false;
    }
    obj.importValues(values, true);
    return obj;
};

/**
 * Default interface for a connection.
 * Implement these methods for a new adapter.
 */
CRUD.ConnectionAdapter = function(endpoint, options) {
    this.endpoint = endpoint || false;
    this.options = options || {};

    this.Init = function() {
        CRUD.log("The Init method for you connection adapter is not implemented!");
        debugger;
    };
    this.Delete = function(what) {
        CRUD.log("The Delete method for your connection adaptor is not implemented!");
        debugger;
    };
    this.Persist = function(what) {
        CRUD.log("The Persist method for your connection adaptor is not implemented!");
        debugger;
    };
    this.Find = function(what, filters, sorting, justthese, options, filters) {
        CRUD.log("The Find method for your connection adaptor is not implemented!");
        debugger;
    };
    return this;
};

CRUD.Entity = function(className, methods) {
    methods = methods || {};
    this.className = className;
    this.values = {};
    this.changedValues = {};
    this._isDirty = false;
    this.customData = {};
    this._customProperties = []; // custom properties to send along to the adapter (handy for form persists)

    CRUD.EntityManager.getFields(className).map(function(field) {
        Object.defineProperty(this, field, {
            get: ((field in methods) && 'get' in methods[field]) ? methods[field].get : function() {
                return this.get(field);
            },
            set: ((field in methods) && 'set' in methods[field]) ? methods[field].set : function(newValue) {
                this.set(field, newValue);
            },
            enumerable: true,
            configurable: false
        });
    }.bind(this));

    Object.keys(CRUD.EntityManager.entities[className].relations).map(function(name) {
        var type = CRUD.EntityManager.entities[className].relations[name];
        if (type == CRUD.RELATION_SINGLE) {
            this['get' + name] = function() {
                var filters = {};
                filters[this.getType()] = {};
                filters[this.getType()][CRUD.EntityManager.getPrimary(this.getType())] = this.getID();
                return CRUD.FindOne(name, filters)
            };
            this['set' + name] = function(entity) {
                this.Connect(entity);
            }
        }
        if (type == CRUD.RELATION_MANY || type == CRUD.RELATION_FOREIGN) {
            this['get' + pluralize(name)] = function(filters) {
                filters = filters || {};
                filters[this.getType()] = {};
                filters[this.getType()][CRUD.EntityManager.getPrimary(this.getType())] = this.getID();
                return CRUD.Find(name, filters)
            };
            this['add' + name] = function(entity) {
                this.Connect(entity);
            }
            this['remove' + name] = function(entity) {
                this.Disconnect(entity);
            }
        }

    }.bind(this))

    for (var j in methods) {
        if (CRUD.EntityManager.getFields(className).indexOf(j) == -1) {
            this[j] = methods[j];
        }
    }

    return this;
};


CRUD.Entity.prototype = {

    getID: function() {
        return this.get(CRUD.EntityManager.getPrimary(this.getType())) || false;
    },

    asObject: function() {
        return this.values;
    },
    /** 
     * Proxy find function, that can be run on the entity instance itself.
     * Makes sure you can create object A, and find just relations connected to it.
     * example:
     *
     * var Project = new Project(1).then(function(proj) {  proj.find(Catalog).then(function( catalogs) { CRUD.log("Fetched catalogs!", catalogs); }});
     * // versus
     * var Project = CRUD.Find(Project, { ID : 1 }).then(function(proj) { CRUD.log("Found project 1", proj); });
     * // or use a join:
     * CRUD.Find(Project, { Catalog: { ID: 1 }}).then(function(projects) { CRUD.log("Found projects connected to catalog 1 !", projects); });
     *
     * @returns Promise
     */
    Find: function(type, filters, options) {
        options = options || {};
        filters = filters || {};
        filters[this.getType()] = {};
        filters[this.getType()][CRUD.EntityManager.getPrimary(this.getType())] = this.getID();
        return CRUD.Find(type, filters, options);
    },

    /**
     * Get al list of all the values to display.
     */
    getValues: function() {
        var v = this.values;
        if (this.changedValues && Array.from(this.changedValues).length > 0) {
            for (var k in this.changedValues) {
                v[k] = this.changedValues[k];
            }
        }
        v.ID = this.getID();
        return v;
    },

    hasField: function(fieldname) {
        return (CRUD.EntityManager.hasField(this.className, fieldname));
    },

    importValues: function(values, dirty) {
        for (var field in values) {
            if (this.hasField(field)) {
                this.values[field] = CRUD.EntityManager.entities[this.className].autoSerialize.indexOf(field) > -1 ? JSON.parse(values[field]) : values[field];
            }
        }
        if (dirty) {
            this._isDirty = true;
            this.changedValues = this.values;
            this.values = {};
        }
        return this;
    },

    /**
     * Accessor. Gets one field, optionally returns the default value.
     */
    get: function(field, def) {
        if (field in this.changedValues) {
            return this.changedValues[field];
        }
        if (field in this.values || this.hasField(field)) {
            return this.values[field];
        }

        CRUD.log("Could not find field '" + field + "' in '" + this.getType() + "' for getting.");

    },

    /**
     * Setter, accepts key / value or object with keys/values
     */
    set: function(field, value) {
        if (this.hasField(field)) {
            if (this.get(field) !== value && !([null, undefined].indexOf(this.get(field)) > -1 && [null, undefined].indexOf(value) > -1)) {
                if (CRUD.EntityManager.entities[this.className].autoSerialize.indexOf(field) > -1) {
                    if (JSON.stringify(this.get(field)) != JSON.stringify(value)) {
                        this.changedValues[field] = value;
                        this._isDirty = true;
                    }
                } else {
                    this.changedValues[field] = value;
                    this._isDirty = true;
                }
            }
        } else if (this._customProperties.indexOf(field) > -1) {
            this.customData[field] = value;
        } else {
            CRUD.log("Could not find field '" + field + "' in '" + this.getType() + "' for setting.");
        }
    },

    /**
     * Persist changes on object using CRUD.Entity.set through the adapter.
     */
    Persist: function(forceInsert) {
        var that = this;
        return new Promise(function(resolve, fail) {
            if (!forceInsert && !that._isDirty) return resolve();

            if (that.get(CRUD.EntityManager.getPrimary(that.className)) === false || forceInsert) {
                var defaults = CRUD.EntityManager.entities[that.className].defaultValues;
                if (Object.keys(defaults).length > 0) {
                    for (var i in defaults) {
                        if (that.hasField(i) && !that.changedValues[i]) {
                            that.changedValues[i] = defaults[i];
                        }
                    }
                }
            }

            return CRUD.EntityManager.getAdapter().Persist(that, forceInsert).then(function(result) {
                CRUD.log(that.getType() + " has been persisted. Result: " + result.Action + ". New Values: " + JSON.stringify(that.changedValues));
                if (result.Action == "inserted") {
                    that.changedValues[CRUD.EntityManager.getPrimary(that.className)] = result.ID;
                    if (!(that.className in CRUD.EntityManager.cache)) {
                        CRUD.EntityManager.cache[that.className] = {};
                    }
                    CRUD.EntityManager.cache[that.className][result.ID] = that;
                }
                that._isDirty = false;
                for (var i in that.changedValues) {
                    that.values[i] = that.changedValues[i];
                }
                that.changedValues = [];
                that.ID = that.values[CRUD.EntityManager.getPrimary(that.className)];

                resolve(result);
            }, function(e) {
                CRUD.log("Error saving CRUD", that, e);
                fail(e);
            });

        });
    },


    /**
     * Delete the object via the adapter.
     * Allows you to call Persist() again on the same object by just setting the ID to false.
     */
    Delete: function() {
        var that = this;
        return CRUD.EntityManager.getAdapter().Delete(that).then(function(result) {
            if (result.Action == 'deleted') {
                CRUD.log(that.getType() + " " + that.getID() + " has been deleted! ");
                delete CRUD.EntityManager.cache[that.className][that.getID()];
                that.values[CRUD.EntityManager.getPrimary(that.className)].ID = false;
            };
            return result;
        });
    },

    /**
     * override toString for easy detection of CRUDs
     */
    toString: function() {
        return 'CRUD';
    },


    /** 
     * Returns the actual className. Should be provided in the entity object.
     * Might not look best, but saves a lot of hassle with reflection
     */
    getType: function() {
        return (this.className);
    },

    /** 
     * Connect 2 entities regardles of their relationship type.
     * Pass the object you want to connect this entity to to this function and
     * this will find out what it needs to do to set the correct properties in your persistence layer.
     * @TODO: update thisPrimary, thatPrimary resolve functions to allow mapping using RELATION_CUSTOM, also, using identified_by propertys
     */
    Connect: function(to) {
        var targetType = to.getType();
        var thisType = this.getType();
        var thisPrimary = this.dbSetup.primary;
        var targetPrimary = to.dbSetup.primary;
        var that = this;
        new Promise(function(resolve, fail) {
            Promise.all([that.Persist(), to.Persist()]).then(function() {
                switch (that.dbSetup.relations[targetType]) {
                    case CRUD.RELATION_SINGLE:
                        to.set(thisPrimary, that.getID());
                        that.set(targetPrimary, to.getID());
                        break;
                    case CRUD.RELATION_FOREIGN:
                        if (to.hasField(thisPrimary)) {
                            to.set(thisPrimary, that.getID());
                        }
                        if (that.hasField(targetPrimary)) {
                            that.set(targetPrimary, to.getID());
                        }
                        break;
                    case CRUD.RELATION_MANY:
                        var connector = new window[that.dbSetup.connectors[targetType]]();
                        connector.set(thisPrimary, that.getID());
                        connector.set(targetPrimary, to.getID());
                        connector.Persist().then(resolve, fail);
                        return;
                        break;
                    case CRUD.RELATION_CUSTOM:
                        //@TODO
                        break;
                }
                if (that.dbSetup.relations[to.getType()] != CRUD.RELATION_MANY) {
                    Promise.all([to.Persist(), from.Persist()]).then(resolve, fail);
                }
            }, fail);
        });
    },

    Disconnect: function(from) {
        var targetType = from.getType();
        var thisType = this.getType();
        var thisPrimary = CRUD.EntityManager.getPrimary(this);
        var targetPrimary = CRUD.Entitymanager.getPrimary(from);
        var that = this;

        new Promise(function(resolve, fail) {
            Promise.all([that.Persist(), from.Persist()]).then(function() {
                switch (this.dbSetup.relations[from.getType()]) {
                    case CRUD.RELATION_SINGLE:
                        from.set(thisPrimary, null);
                        that.set(targetPrimary, null);
                        break;
                    case CRUD.RELATION_FOREIGN:
                        if (from.hasField(thisPrimary)) {
                            from.set(thisPrimary, null);
                        }
                        if (that.hasField(targetPrimary)) {
                            that.set(targetPrimary, null);
                        }
                        break;
                    case CRUD.RELATION_MANY:
                        var filters = {};
                        filters[thisPrimary] = this.getID();
                        filters[targetPrimary] = from.getID();

                        CRUD.FindOne(this.dbSetup.connectors[targetType], filters).then(function(target) {
                            target.Delete().then(resolve, fail);
                        }, fail);
                        return;
                        break;
                    case CRUD.RELATION_CUSTOM:
                        // TODO: implement.
                        break;
                }
                Promise.all([that.Persist(), this.Persist()]).then(resolve, fail);
            }, fail);
        });
    },


    primaryKeyInit: function(ID) {
        this.ID = ID || false;
        if (this.ID !== false) {
            return this.Find({
                "ID": ID
            });
        }
    }
};

if (!('clone' in Object)) {
    Object.clone = function(el) {
        return JSON.parse(JSON.stringify(el));
    }
}


(function(root, pluralize) {
    /* istanbul ignore else */
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // Node.
        module.exports = pluralize();
    } else if (typeof define === 'function' && define.amd) {
        // AMD, registers as an anonymous module.
        define(function() {
            return pluralize();
        });
    } else {
        // Browser global.
        root.pluralize = pluralize();
    }
})(this, function() {
    // Rule storage - pluralize and singularize need to be run sequentially,
    // while other rules can be optimized using an object for instant lookups.
    var pluralRules = [];
    var singularRules = [];
    var uncountables = {};
    var irregularPlurals = {};
    var irregularSingles = {};

    /**
     * Title case a string.
     *
     * @param  {string} str
     * @return {string}
     */
    function toTitleCase(str) {
        return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    }

    /**
     * Sanitize a pluralization rule to a usable regular expression.
     *
     * @param  {(RegExp|string)} rule
     * @return {RegExp}
     */
    function sanitizeRule(rule) {
        if (typeof rule === 'string') {
            return new RegExp('^' + rule + '$', 'i');
        }

        return rule;
    }

    /**
     * Pass in a word token to produce a function that can replicate the case on
     * another word.
     *
     * @param  {string}   word
     * @param  {string}   token
     * @return {Function}
     */
    function restoreCase(word, token) {
        // Upper cased words. E.g. "HELLO".
        if (word === word.toUpperCase()) {
            return token.toUpperCase();
        }

        // Title cased words. E.g. "Title".
        if (word[0] === word[0].toUpperCase()) {
            return toTitleCase(token);
        }

        // Lower cased words. E.g. "test".
        return token.toLowerCase();
    }

    /**
     * Interpolate a regexp string.
     *
     * @param  {[type]} str  [description]
     * @param  {[type]} args [description]
     * @return {[type]}      [description]
     */
    function interpolate(str, args) {
        return str.replace(/\$(\d{1,2})/g, function(match, index) {
            return args[index] || '';
        });
    }

    /**
     * Sanitize a word by passing in the word and sanitization rules.
     *
     * @param  {String}   word
     * @param  {Array}    collection
     * @return {String}
     */
    function sanitizeWord(word, collection) {
        // Empty string or doesn't need fixing.
        if (!word.length || uncountables.hasOwnProperty(word)) {
            return word;
        }

        var len = collection.length;

        // Iterate over the sanitization rules and use the first one to match.
        while (len--) {
            var rule = collection[len];

            // If the rule passes, return the replacement.
            if (rule[0].test(word)) {
                return word.replace(rule[0], function(match, index, word) {
                    var result = interpolate(rule[1], arguments);

                    if (match === '') {
                        return restoreCase(word[index - 1], result);
                    }

                    return restoreCase(match, result);
                });
            }
        }

        return word;
    }

    /**
     * Replace a word with the updated word.
     *
     * @param  {Object}   replaceMap
     * @param  {Object}   keepMap
     * @param  {Array}    rules
     * @return {Function}
     */
    function replaceWord(replaceMap, keepMap, rules) {
        return function(word) {
            // Get the correct token and case restoration functions.
            var token = word.toLowerCase();

            // Check against the keep object map.
            if (keepMap.hasOwnProperty(token)) {
                return restoreCase(word, token);
            }

            // Check against the replacement map for a direct word replacement.
            if (replaceMap.hasOwnProperty(token)) {
                return restoreCase(word, replaceMap[token]);
            }

            // Run all the rules against the word.
            return sanitizeWord(word, rules);
        };
    }

    /**
     * Pluralize or singularize a word based on the passed in count.
     *
     * @param  {String}  word
     * @param  {Number}  count
     * @param  {Boolean} inclusive
     * @return {String}
     */
    function pluralize(word, count, inclusive) {
        var pluralized = count === 1 ?
            pluralize.singular(word) : pluralize.plural(word);

        return (inclusive ? count + ' ' : '') + pluralized;
    }

    /**
     * Pluralize a word.
     *
     * @type {Function}
     */
    pluralize.plural = replaceWord(
        irregularSingles, irregularPlurals, pluralRules
    );

    /**
     * Singularize a word.
     *
     * @type {Function}
     */
    pluralize.singular = replaceWord(
        irregularPlurals, irregularSingles, singularRules
    );

    /**
     * Add a pluralization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    pluralize.addPluralRule = function(rule, replacement) {
        pluralRules.push([sanitizeRule(rule), replacement]);
    };

    /**
     * Add a singularization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    pluralize.addSingularRule = function(rule, replacement) {
        singularRules.push([sanitizeRule(rule), replacement]);
    };

    /**
     * Add an uncountable word rule.
     *
     * @param {(string|RegExp)} word
     */
    pluralize.addUncountableRule = function(word) {
        if (typeof word === 'string') {
            return uncountables[word.toLowerCase()] = true;
        }

        // Set singular and plural references for the word.
        pluralize.addPluralRule(word, '$0');
        pluralize.addSingularRule(word, '$0');
    };

    /**
     * Add an irregular word definition.
     *
     * @param {String} single
     * @param {String} plural
     */
    pluralize.addIrregularRule = function(single, plural) {
        plural = plural.toLowerCase();
        single = single.toLowerCase();

        irregularSingles[single] = plural;
        irregularPlurals[plural] = single;
    };

    /**
     * Irregular rules.
     */
    [
        // Pronouns.
        ['I', 'we'],
        ['me', 'us'],
        ['he', 'they'],
        ['she', 'they'],
        ['them', 'them'],
        ['myself', 'ourselves'],
        ['yourself', 'yourselves'],
        ['itself', 'themselves'],
        ['herself', 'themselves'],
        ['himself', 'themselves'],
        ['themself', 'themselves'],
        ['this', 'these'],
        ['that', 'those'],
        // Words ending in with a consonant and `o`.
        ['echo', 'echoes'],
        ['dingo', 'dingoes'],
        ['volcano', 'volcanoes'],
        ['tornado', 'tornadoes'],
        ['torpedo', 'torpedoes'],
        // Ends with `us`.
        ['genus', 'genera'],
        ['viscus', 'viscera'],
        // Ends with `ma`.
        ['stigma', 'stigmata'],
        ['stoma', 'stomata'],
        ['dogma', 'dogmata'],
        ['lemma', 'lemmata'],
        ['schema', 'schemata'],
        ['anathema', 'anathemata'],
        // Other irregular rules.
        ['ox', 'oxen'],
        ['axe', 'axes'],
        ['die', 'dice'],
        ['yes', 'yeses'],
        ['foot', 'feet'],
        ['eave', 'eaves'],
        ['goose', 'geese'],
        ['tooth', 'teeth'],
        ['quiz', 'quizzes'],
        ['human', 'humans'],
        ['proof', 'proofs'],
        ['carve', 'carves'],
        ['valve', 'valves'],
        ['thief', 'thieves'],
        ['genie', 'genies'],
        ['groove', 'grooves'],
        ['pickaxe', 'pickaxes'],
        ['whiskey', 'whiskies']
    ].forEach(function(rule) {
        return pluralize.addIrregularRule(rule[0], rule[1]);
    });

    /**
     * Pluralization rules.
     */
    [
        [/s?$/i, 's'],
        [/([^aeiou]ese)$/i, '$1'],
        [/(ax|test)is$/i, '$1es'],
        [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
        [/(e[mn]u)s?$/i, '$1s'],
        [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
        [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
        [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
        [/(seraph|cherub)(?:im)?$/i, '$1im'],
        [/(her|at|gr)o$/i, '$1oes'],
        [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
        [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)(?:a|on)$/i, '$1a'],
        [/sis$/i, 'ses'],
        [/(?:(i)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
        [/([^aeiouy]|qu)y$/i, '$1ies'],
        [/([^ch][ieo][ln])ey$/i, '$1ies'],
        [/(x|ch|ss|sh|zz)$/i, '$1es'],
        [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
        [/(m|l)(?:ice|ouse)$/i, '$1ice'],
        [/(pe)(?:rson|ople)$/i, '$1ople'],
        [/(child)(?:ren)?$/i, '$1ren'],
        [/eaux$/i, '$0'],
        [/m[ae]n$/i, 'men']
    ].forEach(function(rule) {
        return pluralize.addPluralRule(rule[0], rule[1]);
    });

    /**
     * Singularization rules.
     */
    [
        [/s$/i, ''],
        [/(ss)$/i, '$1'],
        [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(?:sis|ses)$/i, '$1sis'],
        [/(^analy)(?:sis|ses)$/i, '$1sis'],
        [/([^aeflor])ves$/i, '$1fe'],
        [/(hive|tive|dr?ive)s$/i, '$1'],
        [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
        [/([^aeiouy]|qu)ies$/i, '$1y'],
        [/(^[pl]|zomb|^(?:neck)?t|[aeo][lt]|cut)ies$/i, '$1ie'],
        [/([^c][eor]n|smil)ies$/i, '$1ey'],
        [/(m|l)ice$/i, '$1ouse'],
        [/(seraph|cherub)im$/i, '$1'],
        [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
        [/(e[mn]u)s?$/i, '$1'],
        [/(movie|twelve)s$/i, '$1'],
        [/(cris|test|diagnos)(?:is|es)$/i, '$1is'],
        [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
        [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)a$/i, '$1um'],
        [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)a$/i, '$1on'],
        [/(alumn|alg|vertebr)ae$/i, '$1a'],
        [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
        [/(matr|append)ices$/i, '$1ix'],
        [/(pe)(rson|ople)$/i, '$1rson'],
        [/(child)ren$/i, '$1'],
        [/(eau)x?$/i, '$1'],
        [/men$/i, 'man']
    ].forEach(function(rule) {
        return pluralize.addSingularRule(rule[0], rule[1]);
    });

    /**
     * Uncountable rules.
     */
    [
        // Singular words with no plurals.
        'advice',
        'agenda',
        'bison',
        'bream',
        'buffalo',
        'carp',
        'chassis',
        'cod',
        'cooperation',
        'corps',
        'digestion',
        'debris',
        'diabetes',
        'energy',
        'equipment',
        'elk',
        'excretion',
        'expertise',
        'flounder',
        'gallows',
        'graffiti',
        'headquarters',
        'health',
        'herpes',
        'highjinks',
        'homework',
        'information',
        'jeans',
        'justice',
        'kudos',
        'labour',
        'machinery',
        'mackerel',
        'media',
        'mews',
        'moose',
        'news',
        'pike',
        'plankton',
        'pliers',
        'pollution',
        'premises',
        'rain',
        'rice',
        'salmon',
        'scissors',
        'series',
        'sewage',
        'shambles',
        'shrimp',
        'species',
        'staff',
        'swine',
        'trout',
        'tuna',
        'whiting',
        'wildebeest',
        'wildlife',
        // Regexes.
        /pox$/i, // "chickpox", "smallpox"
        /ois$/i,
        /deer$/i, // "deer", "reindeer"
        /fish$/i, // "fish", "blowfish", "angelfish"
        /sheep$/i,
        /measles$/i,
        /[^aeiou]ese$/i // "chinese", "japanese"
    ].forEach(pluralize.addUncountableRule);

    return pluralize;
});