import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.js"] },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettier,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "prettier/prettier": [
        "warn",
        {
          arrowParens: "always",
          semi: true,
          trailingComma: "es5",
          tabWidth: 2,
          endOfLine: "auto",
          useTabs: false,
          singleQuote: false,
          printWidth: 80,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "import/extensions": "off", // Avoid missing file extension errors, TypeScript already provides a similar feature
      "no-restricted-syntax": [
        "error",
        "ForInStatement",
        "LabeledStatement",
        "WithStatement",
      ], // Overrides Airbnb configuration and enable no-restricted-syntax
      "import/prefer-default-export": "off", // Named export is easier to refactor automatically
      "simple-import-sort/imports": "error", // Import configuration for `eslint-plugin-simple-import-sort`
      "simple-import-sort/exports": "error", // Export configuration for `eslint-plugin-simple-import-sort`
      "import/order": "off", // Avoid conflict rule between `eslint-plugin-import` and `eslint-plugin-simple-import-sort`
      "unused-imports/no-unused-imports": "error",
      // "unused-imports/no-unused-vars": [
      //   "error",
      //   { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }
      // ],
      "no-param-reassign": [
        "error",
        {
          props: true,
          ignorePropertyModificationsFor: ["draft", "acc", "event", "config"],
        },
      ],
      "no-underscore-dangle": ["error", { allow: ["_def", "_retry"] }],
    },
  }
);

