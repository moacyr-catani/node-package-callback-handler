/** @type {import('ts-jest').JestConfigWithTsJest} */
export default 
{
    collectCoverage: true,
    coverageDirectory: '<rootDir>/tests/jest/coverage',
    coveragePathIgnorePatterns: 
    [
        "/tests/"
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    preset: 'ts-jest',
    reporters:       
    [
        'default'
    ],
    rootDir: "./..",
    testEnvironment: 'node',
    testMatch:       
    [
        '<rootDir>/tests/**/*.test.ts'
    ],
    testPathIgnorePatterns: 
    [
        '/node_modules/'
    ],
    transform: 
    {
        "^.+\\.ts?$": 
        [
          "ts-jest",
          {
            useESM: true,
          },
        ]
      },
      extensionsToTreatAsEsm: [".ts"],
      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
      },
      transformIgnorePatterns: 
      [
        ".+\\.js?$"
      ],
      verbose: true,
};