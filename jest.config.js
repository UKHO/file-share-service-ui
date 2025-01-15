const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');
const {defaults} = require('jest-config');

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/Tests/UnitTests/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv:  ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageReporters: ['html','cobertura'],
  coverageDirectory: 'coverage',
  reporters: ["default", "jest-junit"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
    
  }),
  globals: {
    crypto: require('crypto')
  },
  coveragePathIgnorePatterns: ['<rootDir>/src/app/core/services/app-config.service.ts','<rootDir>/src/app/core/services/file-share-api.service.ts']
};




