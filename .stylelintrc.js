module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-idiomatic-order'
    ],
    plugins: ['stylelint-order'],
    rules: {
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'tailwind',
                    'apply',
                    'variants',
                    'responsive',
                    'screen',
                    'layer'
                ]
            }
        ],
        'declaration-block-trailing-semicolon': null,
        indentation: 'tab',
        'no-descending-specificity': null
    }
}