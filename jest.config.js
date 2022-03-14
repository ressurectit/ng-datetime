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
        '^@anglr/datetime/moment$': '<rootDir>/moment/src/index.ts',
        '^@anglr/datetime/date-fns$': '<rootDir>/date-fns/src/index.ts',
    }
}