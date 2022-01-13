module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/scripts/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.{js,jsx,ts,tsx}'],
  testMatch: ['<rootDir>/packages/**/*.(test|spec).(ts|tsx)'],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      // relative path to the ts-jest-keys-transformer.js file
      astTransformers: { before: ['scripts/ts-jest-keys-transformer.js'] },
    },
  },
}
