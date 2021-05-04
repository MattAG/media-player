module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            impliedStrict: true
        },
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended'
    ],
    rules: {
        indent: 'off',
        quotes: 'off',
        'quote-props': ['error', 'as-needed'],
        semi: 'off',
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/no-explicit-any': ['error', {
            fixToUnknown: true
        }],
        'vue/component-tags-order': ['error', {
            order: [ 'template', 'style', 'script' ]
        }],
        'vue/html-closing-bracket-newline': ['error', {
            multiline: 'never'
        }],
        'vue/max-attributes-per-line': ['error', {
            multiline: {
                max: 1,
                allowFirstLine: true
            }
        }],
        'vue/static-class-names-order': 'error'
    },
    overrides: [
        {
            files: '**/*.js',
            rules: {
                '@typescript-eslint/no-var-requires': 'off'
            }
        }
    ]
};
