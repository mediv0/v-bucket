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
        a = (function(t) {
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
        c = (function(t) {
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
        s = (function(t) {
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
        for (var i = e, a = 0; n.length > 1; a++) {
            var c = n.shift();
            if (((o = c), !(i = i._modulesDictionary.get(c))))
                throw new r(
                    "We couldn't find your requested module. path: " +
                        t +
                        " # module: " +
                        c
                );
        }
        return {
            module: i,
            actionName: n.slice(-1).toString(),
            nextModuleName: o,
            nextPath: p.apply(void 0, n)
        };
    }
    var m = function(e) {
            if (!e || !(e instanceof Object) || h(e))
                throw new n(
                    "\n                    you are passing " +
                        e +
                        " as your root module. please provide a valid object format\n                    your object should contain [states, mutations, actions, getters, modules]\n                "
                );
            var o = e.name,
                r = e.states,
                i = e.mutations,
                a = e.actions,
                c = e.getters,
                s = e.modules,
                u = e.plugins,
                l = this;
            (this._name = o || "root"),
                (this._data = t.reactive(r)),
                (this._mutations = i || Object.create(null)),
                (this._getters = this.interceptGetters(
                    l,
                    c || Object.create(null)
                )),
                (this._actions = a || Object.create(null)),
                (this._modules = s || Object.create(null)),
                (this._states = Object.create(null)),
                (this._modulesDictionary = new Map()),
                (this._onMutationSubscribers = new Set()),
                (this._onActionSubscribers = new Set()),
                (this._pluginSubscribers = this.installPlugins(u)),
                (this.commit = function(t, e) {
                    return l.triggerCommit(t, e);
                }),
                (this.dispatch = function(t, e) {
                    return l.triggerDispatch(l, t, e);
                }),
                this.installModules(),
                (function(t) {
                    t._data &&
                        ((t._states = t._data),
                        t._modulesDictionary.size &&
                            t._modulesDictionary.forEach(function(e, n) {
                                t._states[n] = e._states;
                            }));
                })(l);
        },
        d = { state: { configurable: !0 }, getters: { configurable: !0 } };
    return (
        (m.prototype.triggerCommit = function(t, e) {
            var n = f(t, this),
                o = n.module,
                r = n.actionName,
                a = n.nextModuleName,
                c = o._mutations[r];
            if (!c)
                throw new i(
                    "\n                commit " +
                        r +
                        " in " +
                        (a || "root") +
                        " module is invalid. please check your commit name.\n            "
                );
            c(o._data, e),
                this.notifyPlugins("mutation", {
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
                c = o.nextModuleName,
                s = r._actions[i];
            if (!s)
                throw new a(
                    "\n                dispatch " +
                        i +
                        " in " +
                        (c || "root") +
                        " module is invalid. please check your commit name.\n            "
                );
            var u,
                l = s(t, n);
            if (
                null != (u = l) &&
                "function" == typeof u.then &&
                "function" == typeof u.catch
            )
                return l;
            this.notifyPlugins("actions", {
                name: i,
                module: this._name,
                fullPath: "root/" + e,
                payload: n
            });
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
                            a = i.module,
                            s = i.nextModuleName,
                            l = i.nextPath;
                        return (c.namespace = s), a.getters[l];
                    }
                    if (!n[o])
                        throw new c(
                            "\n                            getter " +
                                o +
                                " in " +
                                (c.namespace || "root") +
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
                throw new s(
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
        (m.prototype.notifyPlugins = function(t, e) {
            var n =
                "mutation" === t
                    ? this._onMutationSubscribers
                    : this._onActionSubscribers;
            [].concat(n.values()).forEach(function(t) {
                t(e);
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
