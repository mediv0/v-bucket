import { createBucket } from "../../dist/v-bucket.esm-browser.prod";

// modules
import counter from "./counter";
import shop from "./shop";

export const bucket = createBucket({
    states: {
        // your states here
    },
    mutations: {
        // your mutations here
    },
    getters: {
        // your getters here
    },
    modules: {
        // your modules here
        counter,
        shop
    }
});
