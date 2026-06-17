/**
 * ESLint configuration for the assignment workspace.
 * This file exists to apply Next.js and TypeScript linting rules without embedding logic in source files.
 * It is used by the lint script in package.json and checks files across src/ and configuration code.
 */
module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
};
