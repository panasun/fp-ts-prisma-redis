import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '.(ts|js)': require.resolve('ts-jest'),
  },
  verbose: true,
  testTimeout: 1200000,
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^libs/(.+)$': '<rootDir>/src/libs/$1',
    '^config/(.+)$': '<rootDir>/src/config/$1',
    '^services/(.+)$': '<rootDir>/src/services/$1',
    '^services': '<rootDir>/src/services',
    '^main': '<rootDir>/src/main',
  },
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/*.{test|spec}.{ts,js}',
    '!**/__mocks__/*',
    '!**/coverage/**',
    '!jest.config.js',
    '!**/generated/**',
    '!**/entity/**',
  ],
  coveragePathIgnorePatterns: [
    './src/*/*.types.{ts,js}',
    './src/*/*.interface.{ts,js}',
  ],
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    '/build/',
    '/node_modules/',
    '/.yarn/',
    '/entity/',
    '/tests/',
    '/coverage/',
    '\\.pnp\\.[^\\/]+$',
  ],
  testRegex: '(/__test__/.*|\\.(test|spec))\\.(ts|js)$',
};

export default config;
