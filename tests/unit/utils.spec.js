import * as utils from "@/utils";
import * as errors from "@/Errors";

describe("utils.js", () => {
    it("isDefined should return true, if the passing variable does not have nullish value", () => {
        expect(utils.isDefined(1)).toBeTruthy();
        expect(utils.isDefined(0)).toBeTruthy();
        expect(utils.isDefined(-1)).toBeTruthy();
        expect(utils.isDefined("test")).toBeTruthy();
        expect(utils.isDefined("")).toBeTruthy();
        expect(utils.isDefined({})).toBeTruthy();
        expect(utils.isDefined([])).toBeTruthy();
    });
    it("isDefined should return false, if the passing variable does have nullish value", () => {
        expect(utils.isDefined(null)).toBeFalsy();
        expect(utils.isDefined(undefined)).toBeFalsy();
        expect(utils.isDefined()).toBeFalsy();
    });

    it("isPromise should return true if the passing function is asynchronous", () => {
        const spy = jest.spyOn(utils, "isDefined").mockReturnValue(true);
        const asyncFn = function() {
            return new Promise(resolve => {
                resolve();
            });
        };

        expect(utils.isPromise(asyncFn())).toBe(true);
        spy.mockReset();
    });

    it("isPromise should return false if the passing argument is not asynchronous function", () => {
        const fn = () => {};
        expect(utils.isPromise(fn())).toBe(false);
        expect(utils.isPromise("string")).toBe(false);
        expect(utils.isPromise(1)).toBe(false);
    });

    it("parsePath should return an array that contains given input argument", () => {
        const result = utils.parsePath("test");
        expect(result).toBeInstanceOf(Array);
        expect(result.toString()).toBe("test");
    });

    it("parsePath should convert rawPath to an array", () => {
        const rawPath = "root/path1/path2";
        const result = utils.parsePath(rawPath);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(3);
        for (let i = 0; i < result.length; i++) {
            expect(typeof result[i]).toBe("string");
        }
    });

    it("parsePath should throw an Error if path starts with '/'", () => {
        const rawPath = "/path1/path2";

        expect(() => {
            utils.parsePath(rawPath);
        }).toThrow();

        expect(() => {
            utils.parsePath(rawPath);
        }).toThrow(errors.InvalidModulePath);
    });

    it("parsePath should throw an Error if path ends with '/'", () => {
        const rawPath = "path1/path2/";

        expect(() => {
            utils.parsePath(rawPath);
        }).toThrow();

        expect(() => {
            utils.parsePath(rawPath);
        }).toThrow(errors.InvalidModulePath);
    });

    it("parsePath should throw an Error if path contains multiple '/' one after another eg: 'root//route1' ", () => {
        const rawPath = "path1//path2";

        expect(() => {
            utils.parsePath(rawPath);
        }).toThrow();

        expect(() => {
            utils.parsePath(rawPath);
        }).toThrow(errors.InvalidModulePath);
    });

    it("isPathAlreadyCalculated should return true if the input argument is an array", () => {
        const calculatedPath = ["root", "path"];

        expect(utils.isPathAlreadyCalculated(calculatedPath)).toBe(true);
    });
    it("isPathAlreadyCalculated should return false if the input argument is not an array", () => {
        const rawPath = "root/path";

        expect(utils.isPathAlreadyCalculated(rawPath)).toBe(false);
        expect(utils.isPathAlreadyCalculated(1)).toBe(false);
        expect(utils.isPathAlreadyCalculated(null)).toBe(false);
        expect(utils.isPathAlreadyCalculated(false)).toBe(false);
    });

    it("isString should return true if every element of an array is a string", () => {
        expect(utils.isString(["str1", "str2", "str3"])).toBe(true);
    });

    it("isString should return false if every element of an array is not a string", () => {
        expect(utils.isString(["str1", "str2", 3])).toBe(false);
    });

    it("isString should return false if passing argument is not an array", () => {
        expect(utils.isString(null)).toBe(false);
        expect(utils.isString(1)).toBe(false);
        expect(utils.isString("str")).toBe(false);
        expect(utils.isString(true)).toBe(false);
    });

    it("arrayToPath should return the rawPath of the given path", () => {
        const path1 = ["root", "path1"];
        const path2 = ["root", "path1", "path2"];
        const path3 = ["root", "path1", "path2", "path3"];

        expect(utils.arrayToPath(...path1)).toBe("root/path1");
        expect(utils.arrayToPath(...path2)).toBe("root/path1/path2");
        expect(utils.arrayToPath(...path3)).toBe("root/path1/path2/path3");
        expect(utils.arrayToPath(...path1)).not.toBe("root/path1/");
        expect(utils.arrayToPath(...path2)).not.toBe("root/path1/path2/");
        expect(utils.arrayToPath(...path3)).not.toBe("root/path1/path2/path3/");
    });

    it("isStringNotEmpty should return true if the given argument has content inside it", () => {
        expect(utils.isStringNotEmpty("test content")).toBe(true);
        expect(utils.isStringNotEmpty(1)).toBe(true);
        expect(utils.isStringNotEmpty(true)).toBe(true);
    });

    it("isStringNotEmpty should return false if the given argument has no content inside it", () => {
        expect(utils.isStringNotEmpty("")).toBe(false);
        expect(utils.isStringNotEmpty(" ")).toBe(false);
    });

    it("isObject should return true if parameter is an Object", () => {
        expect(utils.isObject({})).toBe(true);
        expect(utils.isObject({ a: 1 })).toBe(true);
    });

    it("isObject should return false if parameter is not an Object", () => {
        expect(utils.isObject()).toBe(false);
        expect(utils.isObject(null)).toBe(false);
        expect(utils.isObject(true)).toBe(false);
        expect(utils.isObject(1)).toBe(false);
        expect(utils.isObject("test")).toBe(false);
    });

    it("isObjectEmpty should return true if object is empty", () => {
        expect(utils.isObjectEmpty({})).toBe(true);
    });

    it("isObjectEmpty should return false if object is not empty", () => {
        expect(utils.isObjectEmpty({ a: 1 })).toBe(false);
    });
});
