/*!
 * v-bucket v1.1.0
 * (c) 2020 Mahdi Fakhr
 * @license MIT
 */
import { inject as t, reactive as e, computed as n } from "vue";
function o(e) {
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
    u = (function(t) {
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
    l = (function(t) {
        function e(e) {
            t.call(this, e), (this.name = "InstallPluginsOnModulesException");
        }
        return (
            t && (e.__proto__ = t),
            (e.prototype = Object.create(t && t.prototype)),
            (e.prototype.constructor = e),
            e
        );
    })(Error);
function p(t) {
    for (var e = t.split("/"), n = 0; n < e.length; n++)
        if (0 === e[n].length)
            throw new i(
                "\n                Invalid Path. we couldn't find any module in the " +
                    t
            );
    return e;
}
function h(t) {
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
function m(t) {
    return 0 === Object.keys(t).length;
}
function d(t, e) {
    var n = (h(t) && t) || p(t),
        o = "root";
    if (1 === n.length && n.toString().trim().length > 0)
        return { module: e, actionName: t };
    for (var r = e, i = 0; n.length > 1; i++) {
        var c = n.shift();
        if (((o = c), !(r = r._modulesDictionary.get(c))))
            throw new a(
                "We couldn't find your requested module. path: " +
                    t +
                    " # module: " +
                    c
            );
    }
    return {
        module: r,
        actionName: n.slice(-1).toString(),
        nextModuleName: o,
        nextPath: f.apply(void 0, n)
    };
}
var _ = function(t) {
        if (!t || !(t instanceof Object) || m(t))
            throw new r(
                "\n                    you are passing " +
                    t +
                    " as your root module. please provide a valid object format\n                    your object should contain [states, mutations, actions, getters, modules]\n                "
            );
        var n = t.name,
            o = t.states,
            i = t.mutations,
            a = t.actions,
            c = t.getters,
            s = t.modules,
            u = t.plugins,
            l = this;
        (this._name = n || "root"),
            (this._data = e(o)),
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
    y = { state: { configurable: !0 }, getters: { configurable: !0 } };
function g(t) {
    return new _(t);
}
(_.prototype.triggerCommit = function(t, e) {
    var n = d(t, this),
        o = n.module,
        r = n.actionName,
        i = n.nextModuleName,
        a = o._mutations[r];
    if (!a)
        throw new c(
            "\n                commit " +
                r +
                " in " +
                (i || "root") +
                " module is invalid. please check your commit name.\n            "
        );
    a(o._data, e),
        this.notifyPlugins("mutation", {
            name: r,
            module: this._name,
            fullPath: "root/" + t,
            payload: e
        });
}),
    (_.prototype.triggerDispatch = function(t, e, n) {
        var o = d(e, this),
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
    (y.state.get = function() {
        return (
            console.warn(
                "\n            do not mutate state directly, use mutations for changing states value or getters to access the states.\n        "
            ),
            this._states
        );
    }),
    (y.getters.get = function() {
        return this._getters;
    }),
    (_.prototype.interceptGetters = function(t, e) {
        return new Proxy(e, {
            get: function(e, o) {
                var r = p(o);
                if (r.length > 1) {
                    var i = d(r, t),
                        a = i.module,
                        c = i.nextModuleName,
                        s = i.nextPath;
                    return (u.namespace = c), a.getters[s];
                }
                if (!e[o])
                    throw new u(
                        "\n                            getter " +
                            o +
                            " in " +
                            (u.namespace || "root") +
                            " module is not found. please check your getter.\n                        "
                    );
                return n(function() {
                    return e[o](t._data);
                }).value;
            }
        });
    }),
    (_.prototype.installModules = function(t) {
        void 0 === t && (t = this);
        var e = Object.entries(t._modules);
        e.length &&
            e.forEach(function(e) {
                var n = new _(Object.assign({}, { name: e[0] }, e[1]));
                t._modulesDictionary.set(e[0], n);
            });
    }),
    (_.prototype.installPlugins = function(t) {
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
            throw new l(
                "\n                You can only register plugins in the root module."
            );
        return void 0 === t || m(t)
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
    (_.prototype.notifyPlugins = function(t, e) {
        var n =
            "mutation" === t
                ? this._onMutationSubscribers
                : this._onActionSubscribers;
        [].concat(n.values()).forEach(function(t) {
            t(e);
        });
    }),
    (_.prototype.install = function(t, e) {
        t.provide(e || "bucket", this),
            (t.config.globalProperties.$bucket = this);
    }),
    Object.defineProperties(_.prototype, y);
var b = { createBucket: g, Bucket: _, useBucket: o };
export default b;
export { _ as Bucket, g as createBucket, o as useBucket };
