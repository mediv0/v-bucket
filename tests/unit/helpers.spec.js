import { searchNestedModules } from "@/helpers";
import { createLocalBucket, Bucket } from "../utils/createBucket";
import * as utils from "@/utils";
import { ModuleNotFound } from "@/Errors";

describe("helpers.js", () => {
    it("searchNestedModules should return the root module if the path has length of 1", () => {
        utils.parsePath = jest.fn().mockImplementation(() => ["COMMIT"]);
        const rawPath = "COMMIT";
        // fake modules
        const product = {
            states: {
                productID: 1
            }
        };
        const games = {
            states: {
                name: "cyberpunk"
            }
        };
        const bucket = createLocalBucket({
            modules: {
                product,
                games
            }
        });

        const result = searchNestedModules(rawPath, bucket);
        expect(result.module).toBeDefined();
        expect(result.actionName).toBeDefined();
        expect(result.actionName).toBe("COMMIT");

        expect(result.module).toBeInstanceOf(Bucket);
        result.module._modulesDictionary.forEach((pairs, key) => {
            expect(bucket._modulesDictionary.get(key)).toBeDefined();
        });
        expect(result.module._modulesDictionary).toEqual(
            bucket._modulesDictionary
        );
    });
    it("searchNestedModules should calculate the path if argument is a string", () => {
        utils.parsePath = jest.fn().mockImplementation(() => ["path1"]);
        const rawPath = "path1";
        // fake modules
        const product = {
            states: {
                productID: 1
            }
        };
        const games = {
            states: {
                name: "cyberpunk"
            }
        };
        const bucket = createLocalBucket({
            modules: {
                product,
                games
            }
        });

        searchNestedModules(rawPath, bucket);
        expect(utils.parsePath).toHaveBeenCalledTimes(1);
        expect(utils.parsePath).toHaveBeenCalled();
        expect(utils.parsePath).toHaveBeenCalledWith(rawPath);
    });

    it("searchNestedModules should not calculate the new path if its already calculated", () => {
        const spy = jest.spyOn(utils, "isPathAlreadyCalculated");
        const rawPath = ["path1"];
        // fake modules
        const product = {
            states: {
                productID: 1
            }
        };
        const games = {
            states: {
                name: "cyberpunk"
            }
        };
        const bucket = createLocalBucket({
            modules: {
                product,
                games
            }
        });

        searchNestedModules(rawPath, bucket);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(rawPath);
        expect(spy).toHaveReturnedWith(true);
    });

    it("searchNestedModules should return `product` module, if the given path match", () => {
        utils.parsePath = jest
            .fn()
            .mockImplementation(() => ["product", "SET_STATE"]);
        utils.isPathAlreadyCalculated = jest
            .fn()
            .mockImplementation(() => false);
        const rawPath = "product/SET_STATE";
        // fake modules
        const product = {
            states: {
                productID: 1
            }
        };
        const bucket = createLocalBucket({
            modules: {
                product
            }
        });

        const result = searchNestedModules(rawPath, bucket);

        expect(result.module).toBeDefined();
        expect(result.actionName).toBeDefined();
        expect(result.nextModuleName).toBeDefined();
        expect(result.nextPath).toBeDefined();

        expect(result.actionName).toBe("SET_STATE");
        expect(result.nextModuleName).toBe("product");
        expect(result.nextPath).toBe("SET_STATE");

        expect(result.module).toBeInstanceOf(Bucket);
        result.module._modulesDictionary.forEach((pairs, key) => {
            expect(bucket._modulesDictionary.get(key)).toBeDefined();
        });
        expect(result.module).toEqual(bucket._modulesDictionary.get("product"));
    });

    it("searchNestedModules should throw an Error if it couldn't find the module in the given path", () => {
        utils.parsePath = jest
            .fn()
            .mockImplementation(() => ["nonexistence", "SET_STATE"]);
        utils.isPathAlreadyCalculated = jest
            .fn()
            .mockImplementation(() => false);
        const rawPath = "nonexistence/SET_STATE";
        // fake modules
        const product = {
            states: {
                productID: 1
            }
        };
        const bucket = createLocalBucket({
            modules: {
                product
            }
        });

        expect(() => {
            searchNestedModules(rawPath, bucket);
        }).toThrow(ModuleNotFound);
    });

    it("deep searcing the modules should find the correct module in the given path", () => {
        utils.parsePath = jest
            .fn()
            .mockImplementation(() => ["product", "toy", "SET_STATE"]);
        utils.isPathAlreadyCalculated = jest
            .fn()
            .mockImplementation(() => false);
        const rawPath = "product/toy/SET_STATE";
        // fake modules
        const toy = {
            states: {
                toyId: 1
            }
        };
        const product = {
            states: {
                productID: 1
            },
            modules: {
                // nested module inside another module
                toy
            }
        };
        const bucket = createLocalBucket({
            modules: {
                product
            }
        });

        const result = searchNestedModules(rawPath, bucket);

        expect(result.module).toBeDefined();
        expect(result.actionName).toBeDefined();
        expect(result.nextModuleName).toBeDefined();
        expect(result.nextPath).toBeDefined();

        expect(result.actionName).toBe("SET_STATE");
        expect(result.nextModuleName).toBe("toy");

        expect(result.module).toBeInstanceOf(Bucket);
        result.module._modulesDictionary.forEach((pairs, key) => {
            expect(bucket._modulesDictionary.get(key)).toBeDefined();
        });

        const productBucket = bucket._modulesDictionary.get("product");
        const toyBucket = productBucket._modulesDictionary.get("toy");
        expect(result.module).toEqual(toyBucket);
    });

    it("deep searcing the modules should throw an Error if the module not found in the given path", () => {
        utils.parsePath = jest
            .fn()
            .mockImplementation(() => ["product", "toy", "SET_STATE"]);
        utils.isPathAlreadyCalculated = jest
            .fn()
            .mockImplementation(() => false);
        const rawPath = "product/toy/SET_STATE";
        // fake modules
        const product = {
            states: {
                productID: 1
            }
        };
        const bucket = createLocalBucket({
            modules: {
                product
            }
        });

        expect(() => {
            searchNestedModules(rawPath, bucket);
        }).toThrow(ModuleNotFound);
    });

    it("createStateTree should create an object from states of given modules", () => {
        const m1 = {
            states: {
                a: 1
            }
        };

        const m2 = {
            states: {
                b: 2
            }
        };

        const bucket = createLocalBucket(
            {
                states: {
                    root: 3
                },
                modules: {
                    m1,
                    m2
                }
            },
            { createTree: true }
        );

        expect(bucket._states).toBeDefined();
        expect(bucket._states).toBeTruthy();
        expect(bucket._states).toEqual({ root: 3, m1: { a: 1 }, m2: { b: 2 } });
    });
    afterAll(() => {
        jest.resetAllMocks();
    });
});
