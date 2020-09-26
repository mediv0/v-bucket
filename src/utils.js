import { InvalidModulePath } from "./Errors";

export function isDefined(v) {
    return v !== undefined && v !== null;
}

export function isPromise(fn) {
    return (
        isDefined(fn) &&
        typeof fn.then === "function" &&
        typeof fn.catch === "function"
    );
}
export function parsePath(path) {
    const splitted = path.split("/");
    for (let i = 0; i < splitted.length; i++) {
        if (splitted[i].length === 0) {
            throw new InvalidModulePath(`
                Invalid Path. we couldn't find any module in the ${path}`);
        }
    }
    return splitted;
}

export function isPathAlreadyCalculated(v) {
    return Array.isArray(v) && isString(v);
}

export function isString(arr) {
    if (!(arr instanceof Array)) {
        return false;
    }
    return arr.every(v => typeof v === "string");
}

export function arrayToPath(...path) {
    return path.join("/");
}

export function isStringNotEmpty(str) {
    return str.toString().trim().length > 0;
}

export function isObject(o) {
    return o instanceof Object;
}

export function isObjectEmpty(o) {
    return Object.keys(o).length === 0;
}

export function hasPlugin(arr) {
    if (Array.isArray(arr) && arr.length > 0) {
        const _everyFn = arr.every(el => typeof el === "function");
        return _everyFn;
    }
    return false;
}
