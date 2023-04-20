/* eslint-disable */

const darkTheme = require('./src/theme/dark')
const lightTheme = require('./src/theme/light')

module.exports = {
  content: ['src/pages/**/*.{js,ts,jsx,tsx}', 'src/components/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('@tailwindcss/aspect-ratio'), require('tailwindcss-animate')],
  darkMode: 'class', // or 'media' or 'class'
  safelist: [
    'dark:text-madMeta',
    'dark:hover:text-madMeta',
    'dark:border-madMeta',
    'dark:bg-madMeta',
    'dark:hover:bg-madMeta',
    'dark:ring-madMeta',

    'dark:text-madBlue',
    'dark:hover:text-madBlue',
    'dark:border-madBlue',
    'dark:bg-madBlue',
    'dark:hover:bg-madBlue',
    'dark:ring-madBlue',

    'dark:text-madOrange',
    'dark:hover:text-madOrange',
    'dark:border-madOrange',
    'dark:bg-madOrange',
    'dark:hover:bg-madOrange',
    'dark:ring-madOrange',

    'dark:text-madGreen',
    'dark:hover:text-madGreen',
    'dark:border-madGreen',
    'dark:bg-madGreen',
    'dark:hover:bg-madGreen',
    'dark:ring-madGreen',

    'dark:text-madYellow',
    'dark:hover:text-madYellow',
    'dark:border-madYellow',
    'dark:bg-madYellow',
    'dark:hover:bg-madYellow',
    'dark:ring-madYellow',

    'dark:text-madPurple',
    'dark:hover:text-madPurple',
    'dark:border-madPurple',
    'dark:bg-madPurple',
    'dark:hover:bg-madPurple',
    'dark:ring-madPurple',

    'dark:text-madBlueLight',
    'dark:hover:text-madBlueLight',
    'dark:border-madBlueLight',
    'dark:bg-madBlueLight',
    'dark:hover:bg-madBlueLight',
    'dark:ring-madBlueLight',

    'dark:text-madPink',
    'dark:hover:text-madPink',
    'dark:border-madPink',
    'dark:bg-madPink',
    'dark:hover:bg-madPink',
    'dark:ring-madPink',

    'dark:text-madPinkLight',
    'dark:hover:text-madPinkLight',
    'dark:border-madPinkLight',
    'dark:bg-madPinkLight',
    'dark:hover:bg-madPinkLight',
    'dark:ring-madPinkLight',

    'dark:text-madWhite',
    'dark:hover:text-madWhite',
    'dark:border-madWhite',
    'dark:bg-madWhite',
    'dark:hover:bg-madWhite',
    'dark:ring-madWhite',

    'dark:text-madBlack',
    'dark:hover:text-madBlack',
    'dark:border-madBlack',
    'dark:bg-madBlack',
    'dark:hover:bg-madBlack',
    'dark:ring-madBlack',

    'text-madWhite',
    'hover:text-madWhite',
    'border-madWhite',
    'bg-madWhite',
    'hover:bg-madWhite',
    'ring-madWhite',

    'text-madBlack',
    'hover:text-madBlack',
    'border-madBlack',
    'bg-madBlack',
    'hover:bg-madBlack',
    'ring-madBlack',

    'text-madMeta',
    'hover:text-madMeta',
    'border-madMeta',
    'bg-madMeta',
    'hover:bg-madMeta',
    'ring-madMeta',

    'text-madBlue',
    'hover:text-madBlue',
    'border-madBlue',
    'bg-madBlue',
    'hover:bg-madBlue',
    'ring-madBlue',

    'text-madOrange',
    'hover:text-madOrange',
    'border-madOrange',
    'bg-madOrange',
    'hover:bg-madOrange',
    'ring-madOrange',

    'text-madGreen',
    'hover:text-madGreen',
    'border-madGreen',
    'bg-madGreen',
    'hover:bg-madGreen',
    'ring-madGreen',

    'text-madYellow',
    'hover:text-madYellow',
    'border-madYellow',
    'bg-madYellow',
    'hover:bg-madYellow',
    'ring-madYellow',

    'text-madPurple',
    'hover:text-madPurple',
    'border-madPurple',
    'bg-madPurple',
    'hover:bg-madPurple',
    'ring-madPurple',

    'text-madBlueLight',
    'hover:text-madBlueLight',
    'border-madBlueLight',
    'bg-madBlueLight',
    'hover:bg-madBlueLight',
    'ring-madBlueLight',

    'text-madPinkLight',
    'hover:text-madPinkLight',
    'border-madPinkLight',
    'bg-madPinkLight',
    'hover:bg-madPinkLight',
    'ring-madPinkLight',

    'shadow-didLevel0',
    'shadow-didLevel1',
    'shadow-didLevel2',
    'shadow-didLevel3',
    'shadow-didLevel4',
    'shadow-didLevel5'
  ],
  theme: {
    extend: {
      boxShadow: {
        madPinkLg: '0 0 24px -4px #FF1A54',
        madPinkSm: '0 0 4px -4px #FF1A54',
        didLevel: '0 0 24px -4px #FF1A54',
        didLevel1: '0 0 24px -4px #ff1af6',
        didLevel2: '0 0 24px -4px #97661A',
        didLevel3: '0 0 24px -4px #757575',
        didLevel4: '0 0 24px -4px #DBB701'
      },
      colors: {
        madBlack: '#1F2125',
        madWhite: '#F4F4F8',
        madCarbon: '#151619',
        madOnyx: '#0E0F11',
        madBg: '#1F2125',
        socialLink: '#F4F4F8',
        madPink: '#FF1A54',
        madBlue: '#16E7CF',
        madOrange: '#ED6D13',
        madYellow: '#FBBC04',
        madGreen: '#12F452',
        madGray: '#898989',
        madGrayx: '#3C3C3C',
        madBlueLight: '#1DA1F2',
        madPurple: '#9A6AFF',
        madPinkLight: '#cb44a6',
        madMeta: '#20B2E6',
        socialTikTok: '#25F4EE',
        socialFb: '#1877F2',
        socialInsta: '#E1306C',
        socialTwitter: '#1DA1F2',
        socialYt: '#FF0000',
        socialSnap: '#FFFC00',
        socialSpotify: '#1DB954',
        socialItunes: '#EA4CC0',
        socialDeezer: '#C2FF00',
        primary: '#0098A1',
        secondary: '#9A6AFF',
        tertiary: '#353547',
        neutral: '#FFFFFF',
        invert: '#FF1A54',
        failure: '#ED4B9E',
        success: '#31D0AA',
        warning: '#FFB237',
        overlay: '#452A7A',
        background: {
          DEFAULT: '#151e2c',
          disabled: '#3C3742',
          alt: '#27262C',
          ppurple: '#452A7A',
          bblue: '#08060B'
        },
        card: {
          border: '#383241'
        },
        contrast: {
          DEFAULT: '#FFFFFF',
          inverted: '#191326'
        },
        dropdown: {
          DEFAULT: '#1E1D20',
          deep: '#100C18'
        },
        input: {
          DEFAULT: '#372F47',
          secondary: '#262130'
        },
        text: {
          DEFAULT: '#F4EEFF',
          disabled: '#666171',
          subtle: '#B8ADD2'
        },
        border: {
          DEFAULT: '#524B63',
          layout: '#8585851A'
        },
        gradient: {
          bubblegum: {
            1: '#313D5C',
            2: '#3D2A54'
          }
        }
      },
      fontFamily: {
        sans: ['Open sans', 'Segoe UI', 'sans-serif'],
        serif: ['', 'serif']
      },
      fontSize: {
        'xs-asset': '0.6rem',
        'sm-asset': '0.8rem'
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          lg: '0',
          xl: '0',
          '2xl': '1rem'
        }
      },
      width: {},
      height: {
        page: 'calc(100% - 64px)'
      },
      minHeight: {
        8: '2rem',
        16: '4rem',
        18: '4.5rem'
      },
      opacity: {
        65: '0.65',
        85: '0.85'
      },
      zIndex: {
        '-10': '-10',
        100: '100'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      transitionDuration: {
        400: '400ms'
      },
      gridTemplateColumns: {
        toast: '3rem 19rem 3rem'
      }
    },
    rotate: {
      2: '2deg',
      4: '4deg',
      6: '6deg',
      8: '8deg',
      10: '10deg',
      12: '12deg'
    }
  },
  variants: {
    extend: {
      textTransform: ['hover', 'focus'],
      fontFamily: ['hover', 'focus'],
      rotate: ['hover', 'group-hover'],
      translate: ['hover', 'group-hover', 'active'],
      transform: ['hover', 'group-hover', 'active'],
      opacity: ['active'],
      outline: ['focus-visible'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      cursor: ['disabled']
    }
  }
  // plugins: [
  //   require('@tailwindcss/aspect-ratio')
  // ],
}
