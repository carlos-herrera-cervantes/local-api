module.exports = {
  require: [
    "ts-node/register/transpile-only",
    // "tsconfig-paths/register",
    "scripts/mocha/register"
  ],
  recursive: true,
  reporter: "spec",
  spec: [
    "src/**/*.spec.ts",
    "test/**/*.spec.ts"
  ]
};