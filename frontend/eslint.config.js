import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettier,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
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
          jsxSingleQuote: false,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "import/extensions": "off", // Avoid missing file extension errors, TypeScript already provides a similar feature
      "react/function-component-definition": "off", // Disable Airbnb's specific function type
      "react/destructuring-assignment": "off", // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      "react/require-default-props": "off", // Allow non-defined react props as undefined
      "react/jsx-props-no-spreading": "off", // _app.tsx uses spread operator and also, react-hook-form
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
      "react/no-unstable-nested-components": [
        "off",
        {
          allowAsProps: true,
          customValidators: [] /* optional array of validators used for propTypes validation */,
        },
      ],
    },
  }
);
