module.exports = {
    content: ["./src/**/*.{html, ts}"],
    theme: {
        screens: {
            'large-mobile': '480px',

            'tablet': '704px',

            'laptop': '1110px',
        },
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                'green': {
                    'dark': '#6E7D60',
                    'light': '#65895F',
                    'hover': 'rgba(127, 151, 123, 0.2)',
                    'decoration': '#E0DA48',
                    'menu': '#A8B8A5',
                    DEFAULT: '#7F977B'
                },
                'black': {
                    300: '#2F2F2F',
                    700: '#1E1E1E'
                },
                'grey': {
                    'border': '#E6E6E6',
                    'light': '#E5E5E5',
                    'hint': '#9E9E9E',
                    'background': '#F9F9F9',
                    DEFAULT: '#646464'
                },
                'carousel-btn': {
                    'hover': 'rgba(255, 255, 255, 0.2)',
                    DEFAULT: 'transparent'
                },
                'orange': {
                    DEFAULT: '#FF725E'
                },
                'gold': {
                    DEFAULT: '#BEA363'
                }
            },
            fontFamily: {
                'display': 'Playfair Display',
                'tc': 'Noto Sans TC'

            }
        },
    },
    plugins: [],
}
