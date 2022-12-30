module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js", "**/*.spec.ts", "**/*-spec.ts"],
  rules: {
    indent: 0,
    "prettier/prettier": ["error", { singleQuote: false }],
    "@typescript-eslint/typedef": [
      "error",
      {
        arrowParameter: true,
        parameter: true,
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      // interface names do not begin with an I
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: false,
        },
      },
      // classes/enums/types must be in PascalCase
      {
        selector: ["typeLike", "enumMember"],
        format: ["PascalCase"],
      },
      // variable, parameter, functions, properties, methods are in camelCase
      // global constants can be in UPPER_CASE
      {
        selector: ["memberLike", "variableLike", "property", "method"],
        format: ["camelCase", "UPPER_CASE"],
        leadingUnderscore: "forbid",
      },
    ],
    // enable if no explicit type annotations of string/number/boolean desired
    // "@typescript-eslint/no-inferrable-types": "error",
  },
};
