import type { Config } from "jest";

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/env.ts"],
  clearMocks: true,
};

export default config;
