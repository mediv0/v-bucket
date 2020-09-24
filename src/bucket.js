import { reactive, computed } from "vue";
import { bucketKey } from "./inject";
import { isPromise, parsePath, isObject, isObjectEmpty } from "./utils";
import { searchNestedModules, createStateTree } from "./helpers";
import {
    InvalidCommitException,
    InvalidDispatchException,
    InvalidGetterException,
    NoOptionException
} from "./Errors";

export class Bucket {
    constructor(opts) {
        if (!opts || !isObject(opts) || isObjectEmpty(opts)) {
            throw new NoOptionException(
                `
                    you are passing ${opts} as your root module. please provide a valid object format
                    your object should contain [states, mutations, actions, getters, modules]
                `
            );
        }
        const { states, mutations, actions, getters, modules } = opts;
        const _root = this;

        // internal variables
        this._data = reactive(states);
        this._mutations = mutations || Object.create(null);
        this._getters = this.interceptGetters(
            _root,
            getters || Object.create(null)
        );
        this._actions = actions || Object.create(null);
        this._modules = modules || Object.create(null);
        this._states = Object.create(null);
        this._modulesDictionary = new Map();

        this.commit = function boundCommit(_name, _payload) {
            return _root.triggerCommit(_name, _payload);
        };

        this.dispatch = function boundDispatch(_name, _payload) {
            return _root.triggerDispatch(_root, _name, _payload);
        };
        this.installModules();
        createStateTree(this);
    }

    triggerCommit(_name, _payload) {
        // check if path is valid
        const { module, actionName, nextModuleName } = searchNestedModules(
            _name,
            this
        );
        const _fn = module._mutations[actionName];
        if (!_fn) {
            throw new InvalidCommitException(`
                commit ${actionName} in ${nextModuleName ||
                "root"} module is invalid. please check your commit name.
            `);
        }
        _fn(module._data, _payload);
    }

    triggerDispatch(_self, _name, _payload) {
        const { module, actionName, nextModuleName } = searchNestedModules(
            _name,
            this
        );
        const _fn = module._actions[actionName];
        if (!_fn) {
            throw new InvalidDispatchException(`
                dispatch ${actionName} in ${nextModuleName ||
                "root"} module is invalid. please check your commit name.
            `);
        }
        const _asyncDispatch = _fn(_self, _payload);
        // if is current dispatch fn doing an asynchronous task, return it to the user
        if (isPromise(_asyncDispatch)) {
            return _asyncDispatch;
        }
    }

    get state() {
        console.warn(`
            do not mutate state directly, use mutations for changing states value or getters to access the states.
        `);
        return this._states;
    }

    get getters() {
        return this._getters;
    }

    interceptGetters(_self, _target) {
        // finding correct getter recursively from root to bottom
        return new Proxy(_target, {
            get(target, prop) {
                const _path = parsePath(prop);
                if (_path.length > 1) {
                    const {
                        module,
                        nextModuleName,
                        nextPath
                    } = searchNestedModules(_path, _self);
                    // saving a reference to the current module name, in case we don't find any getters.
                    InvalidGetterException.namespace = nextModuleName;
                    /*
                        Since the root module does not have access to its children modules' proxies and we are reading getters object recursively, 
                        Therefore we need to return the next module's proxy back to be able to use it in the root module.
                    */
                    return module.getters[nextPath];
                } else {
                    if (!target[prop]) {
                        throw new InvalidGetterException(`
                            getter ${prop} in ${InvalidGetterException.namespace ||
                            "root"} module is not found. please check your getter.
                        `);
                    }
                    return computed(() => target[prop](_self._data)).value;
                }
            }
        });
    }

    installModules(_instance = this) {
        const entries = Object.entries(_instance._modules);
        if (entries.length) {
            entries.forEach(entry => {
                /* 
                    installModules will be called on new Bucket instance. 
                    so it will recursively register modules for current instance and return it to the root.
                */
                const bucket = new Bucket(entry[1]);
                _instance._modulesDictionary.set(entry[0], bucket);
            });
        } else {
            return;
        }
    }

    install(app, injectKey) {
        app.provide(injectKey || bucketKey, this);
        app.config.globalProperties.$bucket = this;
    }
}

export function createBucket(options) {
    return new Bucket(options);
}
