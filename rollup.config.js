import buble from "@rollup/plugin-buble";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const banner = `/*!
 * v-bucket v${pkg.version}
 * (c) ${new Date().getFullYear()} Mahdi Fakhr
 * @license MIT
 */`;

const configs = [
    {
        input: "src/index.js",
        file: "dist/v-bucket.esm-browser.js",
        format: "es",
        browser: true,
        env: "development"
    },
    {
        input: "src/index.js",
        file: "dist/v-bucket.esm-browser.prod.js",
        minify: true,
        format: "es",
        browser: true,
        env: "production"
    },
    {
        input: "src/index.js",
        file: "dist/v-bucket.esm-bundler.js",
        format: "es",
        env: "development"
    },
    {
        input: "src/index.cjs.js",
        file: "dist/v-bucket.global.js",
        format: "iife",
        env: "development"
    },
    {
        input: "src/index.cjs.js",
        file: "dist/v-bucket.global.prod.js",
        format: "iife",
        minify: true,
        env: "production"
    },
    {
        input: "src/index.cjs.js",
        file: "dist/v-bucket.cjs.js",
        format: "cjs",
        env: "development"
    }
];

function createEntries() {
    return configs.map(c => createEntry(c));
}

function createEntry(config) {
    const c = {
        external: ["vue"],
        input: config.input,
        plugins: [],
        output: {
            banner,
            file: config.file,
            format: config.format,
            globals: {
                vue: "Vue"
            }
        },
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg);
            }
        }
    };

    if (config.format === "iife" || config.format === "umd") {
        c.output.name = c.output.name || "vbucket";
    }

    if (config.transpile !== false) {
        c.plugins.push(
            buble({
                objectAssign: "Object.assign"
            })
        );
    }

    c.plugins.push(resolve());
    c.plugins.push(commonjs());

    if (config.minify) {
        c.plugins.push(terser({ module: config.format === "es" }));
    }

    return c;
}

export default createEntries();
