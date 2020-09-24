/*!
 * vbucket v1.0.0
 * (c) 2020 Mahdi Fakhr
 * @license MIT
 */
import { inject as t, reactive as e, computed as o } from "vue";
function n(e) {
    return void 0 === e && (e = null), t(null !== e ? e : "bucket");
}
var r = (function(t) {
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
    i = (function(t) {
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
    a = (function(t) {
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
    c = (function(t) {
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
    u = (function(t) {
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
    s = (function(t) {
        function e(e, o) {
            t.call(this, e),
                (this.name = "InvalidGetterException"),
                (this._namespace = o);
        }
        t && (e.__proto__ = t),
            (e.prototype = Object.create(t && t.prototype)),
            (e.prototype.constructor = e);
        var o = { namespace: { configurable: !0 } };
        return (
            (o.namespace.get = function() {
                return this._namespace;
            }),
            (o.namespace.set = function(t) {
                this._namespace = t;
            }),
            Object.defineProperties(e, o),
            e
        );
    })(Error);
function l(t) {
    for (var e = t.split("/"), o = 0; o < e.length; o++)
        if (0 === e[o].length)
            throw new i(
                "\n                Invalid Path. we couldn't find any module in the " +
                    t
            );
    return e;
}
function p(t) {
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
function f() {
    for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
    return t.join("/");
}
function h(t, e) {
    var o = (p(t) && t) || l(t),
        n = "root";
    if (1 === o.length && o.toString().trim().length > 0)
        return { module: e, actionName: t };
    for (var r = e, i = 0; o.length > 1; i++) {
        var c = o.shift();
        if (((n = c), !(r = r._modulesDictionary.get(c))))
            throw new a(
                "We couldn't find your requested module. path: " +
                    t +
                    " # module: " +
                    c
            );
    }
    return {
        module: r,
        actionName: o.slice(-1).toString(),
        nextModuleName: n,
        nextPath: f.apply(void 0, o)
    };
}
var m = function(t) {
        if (
            !t ||
            !(t instanceof Object) ||
            (function(t) {
                return 0 === Object.keys(t).length;
            })(t)
        )
            throw new r(
                "\n                    you are passing " +
                    t +
                    " as your root module. please provide a valid object format\n                    your object should contain [states, mutations, actions, getters, modules]\n                "
            );
        var o = t.states,
            n = t.mutations,
            i = t.actions,
            a = t.getters,
            c = t.modules,
            u = this;
        (this._data = e(o)),
            (this._mutations = n || Object.create(null)),
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
                        t._modulesDictionary.forEach(function(e, o) {
                            t._states[o] = e._states;
                        }));
            })(this);
    },
    d = { state: { configurable: !0 }, getters: { configurable: !0 } };
function _(t) {
    return new m(t);
}
(m.prototype.triggerCommit = function(t, e) {
    var o = h(t, this),
        n = o.module,
        r = o.actionName,
        i = o.nextModuleName,
        a = n._mutations[r];
    if (!a)
        throw new c(
            "\n                commit " +
                r +
                " in " +
                (i || "root") +
                " module is invalid. please check your commit name.\n            "
        );
    a(n._data, e);
}),
    (m.prototype.triggerDispatch = function(t, e, o) {
        var n = h(e, this),
            r = n.module,
            i = n.actionName,
            a = n.nextModuleName,
            c = r._actions[i];
        if (!c)
            throw new u(
                "\n                dispatch " +
                    i +
                    " in " +
                    (a || "root") +
                    " module is invalid. please check your commit name.\n            "
            );
        var s,
            l = c(t, o);
        if (
            null != (s = l) &&
            "function" == typeof s.then &&
            "function" == typeof s.catch
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
    (m.prototype.interceptGetters = function(t, e) {
        return new Proxy(e, {
            get: function(e, n) {
                var r = l(n);
                if (r.length > 1) {
                    var i = h(r, t),
                        a = i.module,
                        c = i.nextModuleName,
                        u = i.nextPath;
                    return (s.namespace = c), a.getters[u];
                }
                if (!e[n])
                    throw new s(
                        "\n                            getter " +
                            n +
                            " in " +
                            (s.namespace || "root") +
                            " module is not found. please check your getter.\n                        "
                    );
                return o(function() {
                    return e[n](t._data);
                }).value;
            }
        });
    }),
    (m.prototype.installModules = function(t) {
        void 0 === t && (t = this);
        var e = Object.entries(t._modules);
        e.length &&
            e.forEach(function(e) {
                var o = new m(e[1]);
                t._modulesDictionary.set(e[0], o);
            });
    }),
    (m.prototype.install = function(t, e) {
        t.provide(e || "bucket", this),
            (t.config.globalProperties.$bucket = this);
    }),
    Object.defineProperties(m.prototype, d);
var y = { createBucket: _, Bucket: m, useBucket: n };
export default y;
export { m as Bucket, _ as createBucket, n as useBucket };
