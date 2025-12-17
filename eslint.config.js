import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "app",
    react: true,
    typescript: true,
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
      jsx: true,
    },
    ignores: [
      "**/dist",
      "**/node_modules",
      "**/coverage",
      "**/.vite",
    ],
  },
  {
    rules: {
      "no-console": ["warn"],
      "unicorn/filename-case": ["error", {
        cases: {
          pascalCase: true,
          camelCase: true,
        },
        ignore: ["vite.config.ts"],
      }],
    },
  },
);
