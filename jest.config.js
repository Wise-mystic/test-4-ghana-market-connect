export default {
    transform: {},
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    setupFilesAfterEnv: ['./tests/setup.js'],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    transformIgnorePatterns: [
        'node_modules/(?!(multer-storage-cloudinary)/)'
    ],
    testTimeout: 30000,
    clearMocks: true,
    restoreMocks: true,
    moduleFileExtensions: ['js', 'json'],
    testPathIgnorePatterns: ['/node_modules/'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'controllers/**/*.js',
        'models/**/*.js',
        'routes/**/*.js',
        'utils/**/*.js'
    ]
}; 