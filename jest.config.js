module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    transform: {
        "^.+\\.vue$": "vue-jest"
    },
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "./src/*.js",
        "!./src/index.js",
        "!./src/inject.js",
        "!./src/index.cjs.js"
    ],
    collectCoverage: true
};
