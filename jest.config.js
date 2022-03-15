export default
{
    verbose: true,
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    transformIgnorePatterns: [],
    globals: 
    {
        'ts-jest': 
        {
            tsconfig: 'tsconfig.test.json',
        },
    },
    moduleNameMapper: 
    {
        '^@anglr/datetime$': '<rootDir>/src/index.ts',
        '^@anglr/datetime/(.*?)$': '<rootDir>/$1/src/index.ts'
    }
}