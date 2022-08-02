/**@type {import ('@jest/types').Config.InitialOptions} */

module.exports = {
  roots: ['<rootDir>/'],
  testMatch: ["**/?(*.)+(spec).+(ts|js)"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  reporters: ["default", "jest-junit"],
  testPathIgnorePatterns: ['/node_modules/'],
  testTimeout: 120000
}
