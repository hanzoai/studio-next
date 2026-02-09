import type { CreateTamaguiProps } from '@tamagui/core'
import { allFonts } from './fonts'
import { media } from './media'
import { themes } from './themes'
import { tokens } from './tokens'

const shorthands = {
  ac: 'alignContent',
  ai: 'alignItems',
  bg: 'backgroundColor',
  br: 'borderRadius',
  f: 'flex',
  fd: 'flexDirection',
  fg: 'flexGrow',
  fs: 'flexShrink',
  fw: 'flexWrap',
  jc: 'justifyContent',
  m: 'margin',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  p: 'padding',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'paddingTop',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  w: 'width',
  h: 'height',
} as const

export const configWithoutAnimations = {
  shorthands,
  fonts: allFonts,
  themes,
  tokens,
  media,
  settings: {
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    disableSSR: true,
    onlyAllowShorthands: false,
    allowedStyleValues: false,
    autocompleteSpecificTokens: 'except-special' as const,
    fastSchemeChange: true,
    defaultTheme: 'dark',
  },
} satisfies CreateTamaguiProps
