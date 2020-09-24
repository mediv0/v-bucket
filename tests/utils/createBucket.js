import { createStateTree } from "@/helpers";

export class Bucket {
    constructor(opts) {
        this.opts = opts;
        this._data = opts.states;
        this._modulesDictionary = new Map();
        this._states = Object.create(null);
        this.createFakeModules(opts.modules);
        createStateTree(this);
    }

    createFakeModules(rawModules) {
        // create one level deep module tree
        if (rawModules) {
            const entries = Object.entries(rawModules);
            entries.forEach(entry => {
                const bucket = new Bucket(entry[1]);
                this._modulesDictionary.set(entry[0], bucket);
            });
        }
    }
}

export function createLocalBucket(opts) {
    return new Bucket(opts);
}
