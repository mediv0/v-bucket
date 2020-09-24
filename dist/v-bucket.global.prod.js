/*!
 * vbucket v1.0.0
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
    function s(t) {
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
    function l() {
        for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
        return t.join("/");
    }
    function p(t, e) {
        var n = (s(t) && t) || u(t),
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
            nextPath: l.apply(void 0, n)
        };
    }
    var f = function(e) {
            if (
                !e ||
                !(e instanceof Object) ||
                (function(t) {
                    return 0 === Object.keys(t).length;
                })(e)
            )
                throw new n(
                    "\n                    you are passing " +
                        e +
                        " as your root module. please provide a valid object format\n                    your object should contain [states, mutations, actions, getters, modules]\n                "
                );
            var o = e.states,
                r = e.mutations,
                i = e.actions,
                a = e.getters,
                c = e.modules,
                u = this;
            (this._data = t.reactive(o)),
                (this._mutations = r || Object.create(null)),
                (this._getters = this.interceptGetters(
                    u,
                    a || Object.create(null)
                )),
                (this._actions = i || Object.create(null)),
                (this._modules = c || Object.create(null)),
                (this._states = Object.create(null)),
                (this._modulesDictionary = new Map()),
                (this.commit = function(t, e) {
                    return u.triggerCommit(t, e);
                }),
                (this.dispatch = function(t, e) {
                    return u.triggerDispatch(u, t, e);
                }),
                this.installModules(),
                (function(t) {
                    t._data &&
                        ((t._states = t._data),
                        t._modulesDictionary.size &&
                            t._modulesDictionary.forEach(function(e, n) {
                                t._states[n] = e._states;
                            }));
                })(this);
        },
        h = { state: { configurable: !0 }, getters: { configurable: !0 } };
    return (
        (f.prototype.triggerCommit = function(t, e) {
            var n = p(t, this),
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
            c(o._data, e);
        }),
        (f.prototype.triggerDispatch = function(t, e, n) {
            var o = p(e, this),
                r = o.module,
                i = o.actionName,
                c = o.nextModuleName,
                u = r._actions[i];
            if (!u)
                throw new a(
                    "\n                dispatch " +
                        i +
                        " in " +
                        (c || "root") +
                        " module is invalid. please check your commit name.\n            "
                );
            var s,
                l = u(t, n);
            if (
                null != (s = l) &&
                "function" == typeof s.then &&
                "function" == typeof s.catch
            )
                return l;
        }),
        (h.state.get = function() {
            return (
                console.warn(
                    "\n            do not mutate state directly, use mutations for changing states value or getters to access the states.\n        "
                ),
                this._states
            );
        }),
        (h.getters.get = function() {
            return this._getters;
        }),
        (f.prototype.interceptGetters = function(e, n) {
            return new Proxy(n, {
                get: function(n, o) {
                    var r = u(o);
                    if (r.length > 1) {
                        var i = p(r, e),
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
        (f.prototype.installModules = function(t) {
            void 0 === t && (t = this);
            var e = Object.entries(t._modules);
            e.length &&
                e.forEach(function(e) {
                    var n = new f(e[1]);
                    t._modulesDictionary.set(e[0], n);
                });
        }),
        (f.prototype.install = function(t, n) {
            t.provide(n || e, this), (t.config.globalProperties.$bucket = this);
        }),
        Object.defineProperties(f.prototype, h),
        {
            createBucket: function(t) {
                return new f(t);
            },
            Bucket: f,
            useBucket: function(n) {
                return void 0 === n && (n = null), t.inject(null !== n ? n : e);
            }
        }
    );
})(Vue);
