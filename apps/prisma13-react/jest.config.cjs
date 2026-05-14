module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@prisma13/core$": "<rootDir>/../../packages/core/src/index.js",
    "^@prisma13/integrations$": "<rootDir>/../../packages/integrations/src/index.js",
  },
};
