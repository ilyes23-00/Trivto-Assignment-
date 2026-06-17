/**
 * Vitest configuration for component and service tests.
 * This file exists to give the test runner a JSX transform that matches the repository's React usage without changing Next.js build settings.
 * It interacts with npm test, the component test files, and source files under src/.
 */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
  },
});
