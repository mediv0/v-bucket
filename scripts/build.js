const fs = require("fs-extra");
const chalk = require("chalk");
const execa = require("execa");
const { gzipSync } = require("zlib");
const { compress } = require("brotli");

const files = [
    "dist/v-bucket.esm-browser.js",
    "dist/v-bucket.esm-browser.prod.js",
    "dist/v-bucket.esm-bundler.js",
    "dist/v-bucket.global.js",
    "dist/v-bucket.global.prod.js",
    "dist/v-bucket.cjs.js"
];

async function run() {
    await build();
    checkAllSizes();
}

async function build() {
    await execa("rollup", ["-c", "rollup.config.js"], { stdio: "inherit" });
}

function checkAllSizes() {
    console.log();
    files.map(f => checkSize(f));
    console.log();
}

function checkSize(file) {
    const f = fs.readFileSync(file);
    const minSize = (f.length / 1024).toFixed(2) + "kb";
    const gzipped = gzipSync(f);
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + "kb";
    const compressed = compress(f);
    const compressedSize = (compressed.length / 1024).toFixed(2) + "kb";
    console.log(
        `${chalk.gray(
            chalk.bold(file)
        )} size:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
    );
}

run();
