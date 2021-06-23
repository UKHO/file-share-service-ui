const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/UnitTests/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv:  ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageReporters: ['html','cobertura','lcove','json'],
  coverageDirectory: 'coverage/my-app',
  reporters: ["default","jest-junit"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),
  globals: {
    crypto: require('crypto')
  }
};