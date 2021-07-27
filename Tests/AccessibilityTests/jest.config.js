/**@type {import ('@jest/types').Config.InitialOptions} */

module.exports = {
  preset: 'jest-playwright-preset',
  roots: ['<rootDir>/'],
  testMatch: ["**/?(*.)+(spec).+(ts|js)"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  reporters: ["default","jest-junit"],
  testEnvironmentOptions: {
    'jest-playwright': {
    },
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testTimeout: 120000
}
