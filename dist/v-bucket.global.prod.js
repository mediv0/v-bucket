/*!
 * v-bucket v1.1.0
 * (c) 2020 Mahdi Fakhr
 * @license MIT
 */
var vbucket = (function(t) {
    "use strict";
    var e = "bucket";
    var n = (function(t) {
            function e(e) {
                t.call(this, e), (this.name = "NoOptionException");
            }
            return (
                t && (e.__proto__ = t),
                (e.prototype = Object.create(t && t.prototype)),
                (e.prototype.constructor = e),
                e
            );
        })(Error),
        o = (function(t) {
            function e(e) {
                t.call(this, e), (this.name = "InvalidModulePath");
            }
            return (
                t && (e.__proto__ = t),
                (e.prototype = Object.create(t && t.prototype)),
                (e.prototype.constructor = e),
                e
            );
        })(Error),
        r = (function(t) {
            function e(e) {
                t.call(this, e), (this.name = "ModuleNotFound");
            }
            return (
                t && (e.__proto__ = t),
                (e.prototype = Object.create(t && t.prototype)),
                (e.prototype.constructor = e),
                e
            );
        })(Error),
        i = (function(t) {
            function e(e) {
                t.call(this, e), (this.name = "InvalidCommitException");
            }
            return (
                t && (e.__proto__ = t),
                (e.prototype = Object.create(t && t.prototype)),
                (e.prototype.constructor = e),
                e
            );
        })(Error),
        s = (function(t) {
            function e(e) {
                t.call(this, e), (this.name = "InvalidDispatchException");
            }
            return (
                t && (e.__proto__ = t),
                (e.prototype = Object.create(t && t.prototype)),
                (e.prototype.constructor = e),
                e
            );
        })(Error),
        a = (function(t) {
            function e(e, n) {
                t.call(this, e),
                    (this.name = "InvalidGetterException"),
                    (this._namespace = n);
            }
            t && (e.__proto__ = t),
                (e.prototype = Object.create(t && t.prototype)),
                (e.prototype.constructor = e);
            var n = { namespace: { configurable: !0 } };
            return (
                (n.namespace.get = function() {
                    return this._namespace;
                }),
                (n.namespace.set = function(t) {
                    this._namespace = t;
                }),
                Object.defineProperties(e, n),
                e
            );
        })(Error),
        c = (function(t) {
            function e(e) {
                t.call(this, e),
                    (this.name = "InstallPluginsOnModulesException");
            }
            return (
                t && (e.__proto__ = t),
                (e.prototype = Object.create(t && t.prototype)),
                (e.prototype.constructor = e),
                e
            );
        })(Error);
    function u(t) {
        for (var e = t.split("/"), n = 0; n < e.length; n++)
            if (0 === e[n].length)
                throw new o(
                    "\n                Invalid Path. we couldn't find any module in the " +
                        t
                );
        return e;
    }
    function l(t) {
        return (
            Array.isArray(t) &&
            (function(t) {
                if (!(t instanceof Array)) return !1;
                return t.every(function(t) {
                    return "string" == typeof t;
                });
            })(t)
        );
    }
    function p() {
        for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
        return t.join("/");
    }
    function h(t) {
        return 0 === Object.keys(t).length;
    }
    function f(t, e) {
        var n = (l(t) && t) || u(t),
            o = "root";
        if (1 === n.length && n.toString().trim().length > 0)
            return { module: e, actionName: t };
        for (var i = e, s = 0; n.length > 1; s++)
            if (((o = n.shift()), !(i = i._modulesDictionary.get(o))))
                throw new r(
                    "We couldn't find your requested module. path: " +
                        t +
                        " # module: " +
                        o
                );
        return {
            module: i,
            actionName: n.slice(-1).toString(),
            nextModuleName: o,
            nextPath: p.apply(void 0, n)
        };
    }
    var m = function(t) {
            if (!t || !(t instanceof Object) || h(t))
                throw new n(
                    "\n                    you are passing " +
                        t +
                        " as your root module. please provide a valid object format\n                    your object should contain [states, mutations, actions, getters, modules]\n                "
                );
            var e = this;
            this.initializeSettings(t),
                (this.commit = function(t, n) {
                    return e.triggerCommit(t, n);
                }),
                (this.dispatch = function(t, n) {
                    return e.triggerDispatch(e, t, n);
                }),
                this.installModules(),
                (function(t) {
                    t._data &&
                        ((t._states = t._data),
                        t._modulesDictionary.size &&
                            t._modulesDictionary.forEach(function(e, n) {
                                t._states[n] = e._states;
                            }));
                })(e);
        },
        d = { state: { configurable: !0 }, getters: { configurable: !0 } };
    return (
        (m.prototype.initializeSettings = function(e) {
            var n = e.name,
                o = e.states,
                r = e.mutations,
                i = e.actions,
                s = e.getters,
                a = e.modules,
                c = e.plugins;
            (this._name = n || "root"),
                (this._data = t.reactive(o)),
                (this._mutations = r || Object.create(null)),
                (this._getters = this.interceptGetters(
                    this,
                    s || Object.create(null)
                )),
                (this._actions = i || Object.create(null)),
                (this._modules = a || Object.create(null)),
                (this._states = Object.create(null)),
                (this._modulesDictionary = new Map()),
                (this._onMutationSubscribers = new Set()),
                (this._onActionSubscribers = new Set()),
                (this._pluginSubscribers = this.installPlugins(c));
        }),
        (m.prototype.triggerCommit = function(t, e) {
            var n = f(t, this),
                o = n.module,
                r = n.actionName,
                s = n.nextModuleName,
                a = o._mutations[r];
            if (!a)
                throw new i(
                    "\n                commit " +
                        r +
                        " in " +
                        (s || "root") +
                        " module is invalid. please check your commit name.\n            "
                );
            a(o._data, e),
                this.notifyCommits({
                    name: r,
                    module: this._name,
                    fullPath: "root/" + t,
                    payload: e
                });
        }),
        (m.prototype.triggerDispatch = function(t, e, n) {
            var o = f(e, this),
                r = o.module,
                i = o.actionName,
                a = o.nextModuleName,
                c = r._actions[i];
            if (!c)
                throw new s(
                    "\n                dispatch " +
                        i +
                        " in " +
                        (a || "root") +
                        " module is invalid. please check your commit name.\n            "
                );
            var u,
                l = c(t, n);
            if (
                (this.notifyActions({
                    name: i,
                    module: this._name,
                    fullPath: "root/" + e,
                    payload: n
                }),
                null != (u = l) &&
                    "function" == typeof u.then &&
                    "function" == typeof u.catch)
            )
                return l;
        }),
        (d.state.get = function() {
            return (
                console.warn(
                    "\n            do not mutate state directly, use mutations for changing states value or getters to access the states.\n        "
                ),
                this._states
            );
        }),
        (d.getters.get = function() {
            return this._getters;
        }),
        (m.prototype.interceptGetters = function(e, n) {
            return new Proxy(n, {
                get: function(n, o) {
                    var r = u(o);
                    if (r.length > 1) {
                        var i = f(r, e),
                            s = i.module,
                            c = i.nextModuleName,
                            l = i.nextPath;
                        return (a.namespace = c), s.getters[l];
                    }
                    if (!n[o])
                        throw new a(
                            "\n                            getter " +
                                o +
                                " in " +
                                (a.namespace || "root") +
                                " module is not found. please check your getter.\n                        "
                        );
                    return t.computed(function() {
                        return n[o](e._data);
                    }).value;
                }
            });
        }),
        (m.prototype.installModules = function(t) {
            void 0 === t && (t = this);
            var e = Object.entries(t._modules);
            e.length &&
                e.forEach(function(e) {
                    var n = new m(Object.assign({}, { name: e[0] }, e[1]));
                    t._modulesDictionary.set(e[0], n);
                });
        }),
        (m.prototype.installPlugins = function(t) {
            var e,
                n = this;
            if (
                "root" !== this._name &&
                ((e = t),
                Array.isArray(e) &&
                    e.length > 0 &&
                    e.every(function(t) {
                        return "function" == typeof t;
                    }))
            )
                throw new c(
                    "\n                You can only register plugins in the root module."
                );
            return void 0 === t || h(t)
                ? Object.create(null)
                : ((this.onMutation = function(t) {
                      this._onMutationSubscribers.add(t);
                  }),
                  (this.onAction = function(t) {
                      this._onActionSubscribers.add(t);
                  }),
                  Object.values(t).forEach(function(t) {
                      t(n);
                  }),
                  t);
        }),
        (m.prototype.notifyCommits = function(t) {
            var e = this._onMutationSubscribers;
            this.notifyPlugins(t, e);
        }),
        (m.prototype.notifyActions = function(t) {
            var e = this._onActionSubscribers;
            this.notifyPlugins(t, e);
        }),
        (m.prototype.notifyPlugins = function(t, e) {
            [].concat(e.values()).forEach(function(e) {
                e(t);
            });
        }),
        (m.prototype.install = function(t, n) {
            t.provide(n || e, this), (t.config.globalProperties.$bucket = this);
        }),
        Object.defineProperties(m.prototype, d),
        {
            createBucket: function(t) {
                return new m(t);
            },
            Bucket: m,
            useBucket: function(n) {
                return void 0 === n && (n = null), t.inject(null !== n ? n : e);
            }
        }
    );
})(Vue);
