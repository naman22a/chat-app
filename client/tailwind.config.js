/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {}
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#5865F2',
                    secondary: '#3BA55D',
                    accent: '#1fb2a6',
                    neutral: '#2a323c',
                    'base-100': '#1d232a',
                    info: '#3abff8',
                    success: '#36d399',
                    warning: '#fbbd23',
                    error: '#f87272'
                }
            }
        ]
    },
    plugins: [require('daisyui')]
};
