export const reporters = [
    'default',
    ['jest-junit', { outputDirectory: 'test-results', outputName: 'junit.xml' }]
];
export const coverageReporters = ['cobertura', 'lcov', 'text'];