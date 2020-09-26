/*!
 * v-bucket v1.1.0
 * (c) 2020 Mahdi Fakhr
 * @license MIT
 */
"use strict";

var vue = require("vue");

var bucketKey = "bucket";
function useBucket(key) {
    if (key === void 0) key = null;

    return vue.inject(key !== null ? key : bucketKey);
}

var NoOptionException = /*@__PURE__*/ (function(Error) {
    function NoOptionException(message) {
        Error.call(this, message);
        this.name = "NoOptionException";
    }

    if (Error) NoOptionException.__proto__ = Error;
    NoOptionException.prototype = Object.create(Error && Error.prototype);
    NoOptionException.prototype.constructor = NoOptionException;

    return NoOptionException;
})(Error);

var InvalidModulePath = /*@__PURE__*/ (function(Error) {
    function InvalidModulePath(message) {
        Error.call(this, message);
        this.name = "InvalidModulePath";
    }

    if (Error) InvalidModulePath.__proto__ = Error;
    InvalidModulePath.prototype = Object.create(Error && Error.prototype);
    InvalidModulePath.prototype.constructor = InvalidModulePath;

    return InvalidModulePath;
})(Error);

var ModuleNotFound = /*@__PURE__*/ (function(Error) {
    function ModuleNotFound(message) {
        Error.call(this, message);
        this.name = "ModuleNotFound";
    }

    if (Error) ModuleNotFound.__proto__ = Error;
    ModuleNotFound.prototype = Object.create(Error && Error.prototype);
    ModuleNotFound.prototype.constructor = ModuleNotFound;

    return ModuleNotFound;
})(Error);

var InvalidCommitException = /*@__PURE__*/ (function(Error) {
    function InvalidCommitException(message) {
        Error.call(this, message);
        this.name = "InvalidCommitException";
    }

    if (Error) InvalidCommitException.__proto__ = Error;
    InvalidCommitException.prototype = Object.create(Error && Error.prototype);
    InvalidCommitException.prototype.constructor = InvalidCommitException;

    return InvalidCommitException;
})(Error);

var InvalidDispatchException = /*@__PURE__*/ (function(Error) {
    function InvalidDispatchException(message) {
        Error.call(this, message);
        this.name = "InvalidDispatchException";
    }

    if (Error) InvalidDispatchException.__proto__ = Error;
    InvalidDispatchException.prototype = Object.create(
        Error && Error.prototype
    );
    InvalidDispatchException.prototype.constructor = InvalidDispatchException;

    return InvalidDispatchException;
})(Error);

var InvalidGetterException = /*@__PURE__*/ (function(Error) {
    function InvalidGetterException(message, namespace) {
        Error.call(this, message);
        this.name = "InvalidGetterException";
        this._namespace = namespace;
    }

    if (Error) InvalidGetterException.__proto__ = Error;
    InvalidGetterException.prototype = Object.create(Error && Error.prototype);
    InvalidGetterException.prototype.constructor = InvalidGetterException;

    var staticAccessors = { namespace: { configurable: true } };

    staticAccessors.namespace.get = function() {
        return this._namespace;
    };

    staticAccessors.namespace.set = function(v) {
        this._namespace = v;
    };

    Object.defineProperties(InvalidGetterException, staticAccessors);

    return InvalidGetterException;
})(Error);

var InstallPluginsOnModulesException = /*@__PURE__*/ (function(Error) {
    function InstallPluginsOnModulesException(message) {
        Error.call(this, message);
        this.name = "InstallPluginsOnModulesException";
    }

    if (Error) InstallPluginsOnModulesException.__proto__ = Error;
    InstallPluginsOnModulesException.prototype = Object.create(
        Error && Error.prototype
    );
    InstallPluginsOnModulesException.prototype.constructor = InstallPluginsOnModulesException;

    return InstallPluginsOnModulesException;
})(Error);

function isDefined(v) {
    return v !== undefined && v !== null;
}

function isPromise(fn) {
    return (
        isDefined(fn) &&
        typeof fn.then === "function" &&
        typeof fn.catch === "function"
    );
}
function parsePath(path) {
    var splitted = path.split("/");
    for (var i = 0; i < splitted.length; i++) {
        if (splitted[i].length === 0) {
            throw new InvalidModulePath(
                "\n                Invalid Path. we couldn't find any module in the " +
                    path
            );
        }
    }
    return splitted;
}

function isPathAlreadyCalculated(v) {
    return Array.isArray(v) && isString(v);
}

function isString(arr) {
    if (!(arr instanceof Array)) {
        return false;
    }
    return arr.every(function(v) {
        return typeof v === "string";
    });
}

function arrayToPath() {
    var path = [],
        len = arguments.length;
    while (len--) path[len] = arguments[len];

    return path.join("/");
}

function isStringNotEmpty(str) {
    return str.toString().trim().length > 0;
}

function isObject(o) {
    return o instanceof Object;
}

function isObjectEmpty(o) {
    return Object.keys(o).length === 0;
}

function hasPlugin(arr) {
    if (Array.isArray(arr) && arr.length > 0) {
        var _everyFn = arr.every(function(el) {
            return typeof el === "function";
        });
        return _everyFn;
    }
    return false;
}

function searchNestedModules(path, bucket) {
    // if the path already calculated. there is no need to do it again
    var _nodes = (isPathAlreadyCalculated(path) && path) || parsePath(path);

    var _lastModuleName = "root";
    // if the user just provide a name but not a valid path, we return the root instance
    if (_nodes.length === 1 && isStringNotEmpty(_nodes)) {
        return {
            module: bucket,
            actionName: path
        };
    }
    // set root module
    var _currentModule = bucket;
    // iterate over the modules tree to find the current module
    for (var i = 0; _nodes.length > 1; i++) {
        // remove visited module
        var _nextPath = _nodes.shift();
        _lastModuleName = _nextPath;
        // get nested module if there is any
        _currentModule = _currentModule._modulesDictionary.get(_nextPath);
        if (!_currentModule) {
            throw new ModuleNotFound(
                "We couldn't find your requested module. path: " +
                    path +
                    " # module: " +
                    _nextPath
            );
        }
    }

    /*
            we use slice to prevent mutation
    */
    var actionName = _nodes.slice(-1).toString();
    var nextModuleName = _lastModuleName;
    var nextPath = arrayToPath.apply(void 0, _nodes);
    return {
        module: _currentModule,
        actionName: actionName,
        nextModuleName: nextModuleName,
        nextPath: nextPath
    };
}

function createStateTree(_root) {
    if (_root._data) {
        /*
            saving _data reference in _states, 
            will let us take advantage of Vue reactive system to update our states object dynamically
        */
        _root._states = _root._data;
        if (_root._modulesDictionary.size) {
            _root._modulesDictionary.forEach(function(val, key) {
                _root._states[key] = val._states;
            });
        }
    } else {
        return;
    }
}

var Bucket = function Bucket(opts) {
    if (!opts || !isObject(opts) || isObjectEmpty(opts)) {
        throw new NoOptionException(
            "\n                    you are passing " +
                opts +
                " as your root module. please provide a valid object format\n                    your object should contain [states, mutations, actions, getters, modules]\n                "
        );
    }
    var name = opts.name;
    var states = opts.states;
    var mutations = opts.mutations;
    var actions = opts.actions;
    var getters = opts.getters;
    var modules = opts.modules;
    var plugins = opts.plugins;
    var _root = this;

    // internal variables
    this._name = name || "root";
    this._data = vue.reactive(states);
    this._mutations = mutations || Object.create(null);
    this._getters = this.interceptGetters(
        _root,
        getters || Object.create(null)
    );
    this._actions = actions || Object.create(null);
    this._modules = modules || Object.create(null);
    this._states = Object.create(null);
    this._modulesDictionary = new Map();
    this._onMutationSubscribers = new Set();
    this._onActionSubscribers = new Set();
    this._pluginSubscribers = this.installPlugins(plugins);

    this.commit = function boundCommit(_name, _payload) {
        return _root.triggerCommit(_name, _payload);
    };

    this.dispatch = function boundDispatch(_name, _payload) {
        return _root.triggerDispatch(_root, _name, _payload);
    };

    this.installModules();
    createStateTree(_root);
};

var prototypeAccessors = {
    state: { configurable: true },
    getters: { configurable: true }
};

Bucket.prototype.triggerCommit = function triggerCommit(_name, _payload) {
    // check if path is valid
    var ref = searchNestedModules(_name, this);
    var module = ref.module;
    var actionName = ref.actionName;
    var nextModuleName = ref.nextModuleName;
    var _fn = module._mutations[actionName];
    if (!_fn) {
        throw new InvalidCommitException(
            "\n                commit " +
                actionName +
                " in " +
                (nextModuleName || "root") +
                " module is invalid. please check your commit name.\n            "
        );
    }
    _fn(module._data, _payload);
    this.notifyPlugins("mutation", {
        name: actionName,
        module: this._name,
        fullPath: "root/" + _name,
        payload: _payload
    });
};

Bucket.prototype.triggerDispatch = function triggerDispatch(
    _self,
    _name,
    _payload
) {
    var ref = searchNestedModules(_name, this);
    var module = ref.module;
    var actionName = ref.actionName;
    var nextModuleName = ref.nextModuleName;
    var _fn = module._actions[actionName];
    if (!_fn) {
        throw new InvalidDispatchException(
            "\n                dispatch " +
                actionName +
                " in " +
                (nextModuleName || "root") +
                " module is invalid. please check your commit name.\n            "
        );
    }
    var _asyncDispatch = _fn(_self, _payload);
    // if is current dispatch fn doing an asynchronous task, return it to the user
    if (isPromise(_asyncDispatch)) {
        return _asyncDispatch;
    }

    this.notifyPlugins("actions", {
        name: actionName,
        module: this._name,
        fullPath: "root/" + _name,
        payload: _payload
    });
};

prototypeAccessors.state.get = function() {
    console.warn(
        "\n            do not mutate state directly, use mutations for changing states value or getters to access the states.\n        "
    );
    return this._states;
};

prototypeAccessors.getters.get = function() {
    return this._getters;
};

Bucket.prototype.interceptGetters = function interceptGetters(_self, _target) {
    // finding correct getter recursively from root to bottom
    return new Proxy(_target, {
        get: function get(target, prop) {
            var _path = parsePath(prop);
            if (_path.length > 1) {
                var ref = searchNestedModules(_path, _self);
                var module = ref.module;
                var nextModuleName = ref.nextModuleName;
                var nextPath = ref.nextPath;
                // saving a reference to the current module name, in case we don't find any getters.
                InvalidGetterException.namespace = nextModuleName;
                /*
                    Since the root module does not have access to its children modules' proxies and we are reading getters object recursively, 
                    Therefore we need to return the next module's proxy back to be able to use it in the root module.
                */
                return module.getters[nextPath];
            } else {
                if (!target[prop]) {
                    throw new InvalidGetterException(
                        "\n                            getter " +
                            prop +
                            " in " +
                            (InvalidGetterException.namespace || "root") +
                            " module is not found. please check your getter.\n                        "
                    );
                }
                return vue.computed(function() {
                    return target[prop](_self._data);
                }).value;
            }
        }
    });
};

Bucket.prototype.installModules = function installModules(_instance) {
    if (_instance === void 0) _instance = this;

    var entries = Object.entries(_instance._modules);
    if (entries.length) {
        entries.forEach(function(entry) {
            /* 
                installModules will be called on new Bucket instance. 
                so it will recursively register modules for current instance and return it to the root.
            */
            var bucket = new Bucket(
                Object.assign(
                    {},
                    { name: entry[0] }, // set name for each module
                    entry[1]
                )
            );
            _instance._modulesDictionary.set(entry[0], bucket);
        });
    } else {
        return;
    }
};

Bucket.prototype.installPlugins = function installPlugins(_plugins) {
    var this$1 = this;

    if (this._name !== "root" && hasPlugin(_plugins)) {
        throw new InstallPluginsOnModulesException(
            "\n                You can only register plugins in the root module."
        );
    }

    if (_plugins === undefined || isObjectEmpty(_plugins)) {
        return Object.create(null);
    }

    this.onMutation = function boundNotify(_cb) {
        this._onMutationSubscribers.add(_cb);
    };
    this.onAction = function boundNotify(_cb) {
        this._onActionSubscribers.add(_cb);
    };

    // call the plugins
    Object.values(_plugins).forEach(function(plugin) {
        plugin(this$1);
    });

    return _plugins;
};

Bucket.prototype.notifyPlugins = function notifyPlugins(_type, _value) {
    // maybe use ENUMS idk!
    var _callbackFns =
        _type === "mutation"
            ? this._onMutationSubscribers
            : this._onActionSubscribers;
    [].concat(_callbackFns.values()).forEach(function(cb) {
        cb(_value);
    });
};

Bucket.prototype.install = function install(app, injectKey) {
    app.provide(injectKey || bucketKey, this);
    app.config.globalProperties.$bucket = this;
};

Object.defineProperties(Bucket.prototype, prototypeAccessors);

function createBucket(options) {
    return new Bucket(options);
}

var index_cjs = {
    createBucket: createBucket,
    Bucket: Bucket,
    useBucket: useBucket
};

module.exports = index_cjs;
