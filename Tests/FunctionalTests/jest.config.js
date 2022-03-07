/**@type {import ('@jest/types').Config.InitialOptions} */

  module.exports = {
    preset: 'jest-playwright-preset',
    roots: ['<rootDir>/'],
    testMatch: ["**/?(*.)+(spec).+(ts|js)"],
    reporters: ["default","jest-junit"],
    transform: {
      "^.+\\.(ts)$": "ts-jest",
    },
    testPathIgnorePatterns: ['/node_modules/'],
    testTimeout: 120000,
    globalSetup: "./global-setup.js"
  }

