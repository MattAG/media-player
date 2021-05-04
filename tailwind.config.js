const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    purge: [
        './index.html',
        './src/**/*.{vue,js,ts}'
    ],
    darkMode: 'class',
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            amber: colors.amber,
            black: colors.black,
            blue: colors.blue,
            blueGrey: colors.blueGray,
            coolGray: colors.coolGray,
            cyan: colors.cyan,
            emerald: colors.emerald,
            fuchsia: colors.fuchsia,
            green: colors.green,
            grey: colors.gray,
            indigo: colors.indigo,
            lightBlue: colors.lightBlue,
            lime: colors.lime,
            orange: colors.orange,
            pink: colors.pink,
            purple: colors.purple,
            red: colors.red,
            rose: colors.rose,
            teal: colors.teal,
            trueGrey: colors.trueGray,
            violet: colors.violet,
            warmGrey: colors.warmGray,
            white: colors.white,
            yellow: colors.yellow
        },
        extend: {
            cursor:{
                none: 'none'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms')
    ]
};
