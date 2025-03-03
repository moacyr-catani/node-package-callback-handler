/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = 
{
    coveragePathIgnorePatterns: 
    [
        "/tests/"
    ],

    preset: 'ts-jest',
    testEnvironment: 'node',

    transform: 
    {
        '^.+\\.[tj]sx?$': 
        [
            'ts-jest',
            {
                tsconfig: './configs/tsconfig.esm.json'
            },
        ]
    }
};