import globals from "globals";
import tsEslint from "typescript-eslint";
import paratcoEslintConfig from "@paratco/eslint-config";

export default tsEslint.config(
  ...paratcoEslintConfig.react,
  ...paratcoEslintConfig.prettierFormatter,

  { languageOptions: { globals: globals.browser } },

  {
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        project: "./tsconfig.app.json",
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  {
    ignores: ["dist", "eslint.config.mjs", "vite.config.ts", "vite-env.d.ts"]
  }
);
