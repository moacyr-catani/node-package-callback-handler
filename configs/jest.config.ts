/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {

    coverageDirectory: './../coverage',
    //coveragePathIgnorePatterns: ['node_modules', 'src/database', 'src/test', 'src/types'],
    coveragePathIgnorePatterns: 
    [
        "/tests/"
    ],
    // globals: 
    // { 
    //     'ts-jest': { diagnostics: false } 
    // },
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

    // transform: {
    //     <transform_regex>: ['ts-jest', { /* ts-jest config goes here in Jest */ }],
    // },

    // transform: 
    // {
    //     '^.+\\.[tj]sx?$': 
    //     [
    //         'ts-jest',
    //         {
    //             "ts-jest": './configs/tsconfig.esm.json'
    //         },
    //     ]
    // },

    transform: 
    {
        "^.+\\.ts?$": [
          "ts-jest",
          {
            useESM: true,
          },
        ],
      },
      extensionsToTreatAsEsm: [".ts"],
      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
      },


    verbose: true,
};