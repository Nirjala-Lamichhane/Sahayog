module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/testing/**/*.test.js',
    '**/testing/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  testTimeout: 10000
};
