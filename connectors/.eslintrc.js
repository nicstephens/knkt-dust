module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "deprecation", "simple-import-sort"],
  extends: ["eslint:recommended", "prettier"],
  rules: {
    // recommended for safety
    "@typescript-eslint/no-floating-promises": "error", // forgetting to await Activities and Workflow APIs is bad
    "deprecation/deprecation": "warn",

    // code style preference
    "object-shorthand": ["error", "always"],

    // relaxed rules, for convenience
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Side effect imports.
          ["^\\u0000"],
          // Node.js builtins prefixed with `node:`.
          ["^node:"],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ["^@?\\w"],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ["^"],
          // Relative imports.
          // Anything that starts with a dot.
          ["^\\."],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  ],
};