/**@type {import ('@jest/types').Config.InitialOptions} */

  module.exports = {
    preset: 'jest-playwright-preset',
    roots: ['<rootDir>/'],
    testMatch: ["**/?(*.)+(spec).+(ts|js)"],
    transform: {
      "^.+\\.(ts)$": "ts-jest",
    },
    testEnvironmentOptions: {
      'jest-playwright': {
      },
    },
    testPathIgnorePatterns: ['/node_modules/'],
  }

 