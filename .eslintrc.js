module.exports = {
    env: {
        es6: true,
        node: true,
        browser: false,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'prettier',
        'plugin:jest/recommended',
    ],
    plugins: ['import', 'prettier', 'jest'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'es5',
            },
        ],
        'import/no-extraneous-dependencies': 'off',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-unused-vars': ['error', { ignoreRestSiblings: true }],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'off',
        'jest/valid-expect': 'error',
    },
};
