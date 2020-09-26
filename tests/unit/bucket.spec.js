import { createBucket, Bucket } from "@/index";
import {
    NoOptionException,
    InvalidCommitException,
    InvalidDispatchException,
    InvalidGetterException,
    InstallPluginsOnModulesException
} from "@/Errors";

import { createApp } from "vue";

describe("bucket.js", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => "");

    it("bucket injection", () => {
        const bucket = createBucket({
            states: {
                a: 1
            }
        });

        const spy = jest.spyOn(bucket, "install");

        const app2 = createApp();
        app2.use(bucket);

        expect(spy).toHaveBeenCalled();
        expect(app2.config.globalProperties.$bucket).toBeDefined();
        expect(app2._context.provides.bucket).toBeDefined();
    });
    it("creating new bucket without passing options or passing it with anything other than object type, should throw an error", () => {
        expect(() => {
            createBucket();
        }).toThrow(NoOptionException);
        expect(() => {
            createBucket({});
        }).toThrow(NoOptionException);
    });

    it("accessing state directly should warn the user in the console", () => {
        const bucket = createBucket({
            states: {
                a: 1
            }
        });

        bucket.state.a;
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("installing 3 modules should create 3 Bucket instances", () => {
        // modules
        const m1 = {
            states: {}
        };
        const m2 = {
            states: {}
        };
        const m3 = {
            states: {}
        };

        const bucket = createBucket({
            states: {},
            modules: {
                m1,
                m2,
                m3
            }
        });

        // start with 1, because of root instance
        let count = 1;
        bucket._modulesDictionary.forEach(instance => {
            count += 1;
            expect(instance).toBeInstanceOf(bucket.constructor);
        });
        expect(count).toBe(4);
    });

    it("committing a mutation for root module", () => {
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, playload) {
                    state.a = playload;
                }
            }
        });

        bucket.commit("SET_A", 2);
        expect(bucket.state.a).toBe(2);
    });

    it("committing a 2 level deep mutation", () => {
        const testModule = {
            states: {
                b: 1
            },
            mutations: {
                SET_B(state, payload) {
                    state.b = payload;
                }
            }
        };
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, playload) {
                    state.a = playload;
                }
            },
            modules: {
                testModule
            }
        });

        bucket.commit("testModule/SET_B", 2);
        expect(bucket.state.testModule.b).toBe(2);
    });

    it("committing a 3 level deep mutation", () => {
        const testModule2 = {
            states: {
                c: 1
            },
            mutations: {
                SET_C(state, payload) {
                    state.c = payload;
                }
            }
        };
        const testModule1 = {
            states: {
                b: 1
            },
            mutations: {
                SET_B(state, payload) {
                    state.b = payload;
                }
            },
            modules: {
                testModule2
            }
        };
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, playload) {
                    state.a = playload;
                }
            },
            modules: {
                testModule1
            }
        });

        bucket.commit("testModule1/testModule2/SET_C", 2);
        expect(bucket.state.testModule1.testModule2.c).toBe(2);
    });

    it("committing a 4 level deep mutation", () => {
        const testModule3 = {
            states: {
                d: 1
            },
            mutations: {
                SET_D(state, payload) {
                    state.d = payload;
                }
            }
        };

        const testModule2 = {
            states: {
                c: 1
            },
            mutations: {
                SET_C(state, payload) {
                    state.c = payload;
                }
            },
            modules: {
                testModule3
            }
        };
        const testModule1 = {
            states: {
                b: 1
            },
            mutations: {
                SET_B(state, payload) {
                    state.b = payload;
                }
            },
            modules: {
                testModule2
            }
        };
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, playload) {
                    state.a = playload;
                }
            },
            modules: {
                testModule1
            }
        });

        bucket.commit("testModule1/testModule2/testModule3/SET_D", 2);
        expect(bucket.state.testModule1.testModule2.testModule3.d).toBe(2);
    });

    it("commit function should throw an error if commit name is not found", () => {
        expect(() => {
            const bucket = createBucket({
                states: {
                    a: 1
                },
                mutations: {
                    SET_A(state, playload) {
                        state.a = playload;
                    }
                }
            });
            bucket.commit("noCommit");
        }).toThrow(InvalidCommitException);
    });

    it("dispatching an action", () => {
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, playload) {
                    state.a = playload;
                }
            },
            actions: {
                actionTest({ commit }) {
                    commit("SET_A", 2);
                }
            }
        });

        bucket.dispatch("actionTest", 2);
        expect(bucket.state.a).toBe(2);
    });

    it("dispatching an asynchronous action", () => {
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, playload) {
                    state.a = playload;
                }
            },
            actions: {
                actionTest({ commit }) {
                    return new Promise(resolve => {
                        commit("SET_A", 2);
                        resolve();
                    });
                }
            }
        });

        let result = bucket.dispatch("actionTest", 2);
        expect(result).toBeDefined();
        expect(typeof result.then).toBe("function");
    });

    it("dispatching 2 level deep action", () => {
        const testModule1 = {
            states: {
                b: 1
            },
            mutations: {
                SET_B(state, payload) {
                    state.b = payload;
                }
            },
            actions: {
                actionTest({ commit }) {
                    commit("testModule1/SET_B", 2);
                }
            }
        };
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, playload) {
                    state.a = playload;
                }
            },
            modules: {
                testModule1
            }
        });

        bucket.dispatch("testModule1/actionTest", 2);
        expect(bucket.state.testModule1.b).toBe(2);
    });

    it("dispatch function should throw an error if dispatch name is not found", () => {
        expect(() => {
            const bucket = createBucket({
                states: {
                    a: 1
                },
                mutations: {
                    SET_A(state, playload) {
                        state.a = playload;
                    }
                }
            });
            bucket.dispatch("noDispatch");
        }).toThrow(InvalidDispatchException);
    });

    it("getters should return state value", () => {
        const bucket = createBucket({
            states: {
                a: 1
            },
            getters: {
                GET_A(state) {
                    return state.a;
                }
            }
        });

        const result = bucket.getters["GET_A"];
        expect(result).toBe(1);
    });

    it("2 level deep getters should return state value", () => {
        const testModule1 = {
            states: {
                b: 1
            },
            getters: {
                GET_B(state) {
                    return state.b;
                }
            }
        };
        const bucket = createBucket({
            states: {
                a: 1
            },
            modules: {
                testModule1
            }
        });

        const result = bucket.getters["testModule1/GET_B"];
        expect(result).toBe(1);
    });

    it("getters should throw an error if getter name is not found", () => {
        expect(() => {
            const bucket = createBucket({
                states: {
                    a: 1
                }
            });
            bucket.getters["noGetters"];
        }).toThrow(InvalidGetterException);
    });

    it("fire a dispatch from another dispatch", () => {
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, payload) {
                    state.a = payload;
                }
            },
            actions: {
                actionA({ commit }, payload) {
                    commit("SET_A", payload);
                },
                launchA({ dispatch }) {
                    dispatch("actionA", 2);
                }
            }
        });

        bucket.dispatch("launchA");
        expect(bucket.state.a).toBe(2);
    });

    it("commit and get state value from dispatch", () => {
        const bucket = createBucket({
            states: {
                a: 1
            },
            mutations: {
                SET_A(state, payload) {
                    state.a = payload;
                }
            },
            getters: {
                GET_A(state) {
                    return state.a;
                }
            }
        });

        bucket.commit("SET_A", 2);
        expect(bucket.getters["GET_A"]).toBe(2);
    });

    it("installing a plugin", () => {
        const myPlugin = jest.fn();
        const installPluginsSpy = jest.spyOn(
            Bucket.prototype,
            "installPlugins"
        );
        myPlugin.mockReturnValue(() => {});

        const plugins = [myPlugin()];
        const bucket = createBucket({
            plugins
        });

        expect(bucket._pluginSubscribers).toEqual(plugins);
        expect(bucket._pluginSubscribers.length).toBe(1);
        expect(installPluginsSpy).toHaveBeenCalledWith(plugins);
        expect(installPluginsSpy).toHaveBeenCalledTimes(1);
        expect(myPlugin).toHaveBeenCalled();
    });

    it("installing plugins on child modules should throw an error", () => {
        const myPlugin = jest.fn();
        myPlugin.mockReturnValue(() => {});

        const plugins = [myPlugin()];

        const module1 = {
            plugins
        };

        expect(() => {
            createBucket({
                modules: {
                    module1
                }
            });
        }).toThrow(InstallPluginsOnModulesException);
    });

    it("installing a plugin with hooks", () => {
        const myPlugin = () => bucket => {
            bucket.onMutation(() => {});
            bucket.onAction(() => {});
        };

        const plugins = [myPlugin()];
        const bucket = createBucket({
            plugins
        });

        expect(bucket._pluginSubscribers).toEqual(plugins);
        expect(bucket._pluginSubscribers.length).toBe(1);
        expect(bucket._onMutationSubscribers.size).toBe(1);
        expect(bucket._onActionSubscribers.size).toBe(1);
    });

    it("installing a plugin with multiple hooks", () => {
        const myPlugin = () => bucket => {
            bucket.onMutation(() => {});
            bucket.onMutation(() => {});
            bucket.onMutation(() => {});

            bucket.onAction(() => {});
            bucket.onAction(() => {});
        };

        const plugins = [myPlugin()];
        const bucket = createBucket({
            plugins
        });

        expect(bucket._pluginSubscribers).toEqual(plugins);
        expect(bucket._pluginSubscribers.length).toBe(1);
        expect(bucket._onMutationSubscribers.size).toBe(3);
        expect(bucket._onActionSubscribers.size).toBe(2);
    });

    it("committing a mutation should notify onMutation hooks", () => {
        const onMutationSpy = jest.spyOn(Bucket.prototype, "notifyPlugins");

        const mutationMock = {
            name: "SET_ID",
            module: "root",
            fullPath: "root/SET_ID",
            payload: undefined
        };
        const onMutationCallback = jest.fn();

        const myPlugin = () => bucket => {
            bucket.onMutation(onMutationCallback);
        };

        const plugins = [myPlugin()];
        const bucket = createBucket({
            states: {
                id: 1
            },
            mutations: {
                SET_ID(state) {
                    state.id = 2;
                }
            },
            plugins
        });

        expect(bucket._pluginSubscribers).toEqual(plugins);
        expect(bucket._pluginSubscribers.length).toBe(1);
        expect(bucket._onMutationSubscribers.size).toBe(1);

        bucket.commit("SET_ID");
        expect(onMutationSpy).toHaveBeenCalled();
        expect(onMutationSpy).toHaveBeenCalledTimes(1);
        expect(onMutationSpy).toHaveBeenCalledWith("mutation", mutationMock);

        expect(onMutationCallback).toHaveBeenCalled();
        expect(onMutationCallback).toHaveBeenCalledWith(mutationMock);
        onMutationSpy.mockClear();
    });

    it("dispatching an action should notify onAction hooks", () => {
        const onMutationSpy = jest.spyOn(Bucket.prototype, "notifyPlugins");

        const actionMock = {
            name: "SET_ID",
            module: "root",
            fullPath: "root/SET_ID",
            payload: undefined
        };
        const onActionCallback = jest.fn();

        const myPlugin = () => bucket => {
            bucket.onAction(onActionCallback);
        };

        const plugins = [myPlugin()];
        const bucket = createBucket({
            states: {
                id: 1
            },
            actions: {
                SET_ID() {
                    // do nothing
                }
            },
            plugins
        });

        expect(bucket._pluginSubscribers).toEqual(plugins);
        expect(bucket._pluginSubscribers.length).toBe(1);
        expect(bucket._onActionSubscribers.size).toBe(1);

        bucket.dispatch("SET_ID");
        expect(onMutationSpy).toHaveBeenCalled();
        expect(onMutationSpy).toHaveBeenCalledTimes(1);
        expect(onMutationSpy).toHaveBeenCalledWith("actions", actionMock);

        expect(onActionCallback).toHaveBeenCalled();
        expect(onActionCallback).toHaveBeenCalledWith(actionMock);
    });
});
