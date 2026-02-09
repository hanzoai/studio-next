import { colorsDark, colorsLight } from './colors'

const { none: darkTransparent, ...tamaguiColorsDark } = colorsDark
const { none: lightTransparent, ...tamaguiColorsLight } = colorsLight

const dark = {
  ...tamaguiColorsDark,
  transparent: darkTransparent,

  // Tamagui theme tokens
  background: colorsDark.surface1,
  backgroundHover: colorsDark.surface2,
  backgroundPress: colorsDark.surface2,
  backgroundFocus: colorsDark.surface2,
  borderColor: colorsDark.neutral4,
  borderColorHover: colorsDark.neutral3,
  borderColorFocus: colorsDark.primary,
  outlineColor: colorsDark.none,
  color: colorsDark.neutral1,
  colorHover: colorsDark.accent1,
  colorPress: colorsDark.accent1,
  colorFocus: colorsDark.accent1,
  shadowColor: 'rgba(0,0,0,0.4)',
  shadowColorHover: 'rgba(0,0,0,0.5)',
}

type BaseTheme = typeof dark

const light: BaseTheme = {
  ...tamaguiColorsLight,
  transparent: lightTransparent,

  background: colorsLight.surface1,
  backgroundHover: colorsLight.surface2,
  backgroundPress: colorsLight.surface2,
  backgroundFocus: colorsLight.surface2,
  borderColor: colorsLight.neutral4,
  borderColorHover: colorsLight.neutral3,
  borderColorFocus: colorsLight.primary,
  outlineColor: colorsLight.none,
  color: colorsLight.neutral1,
  colorHover: colorsLight.accent1,
  colorPress: colorsLight.accent1,
  colorFocus: colorsLight.accent1,
  shadowColor: 'rgba(0,0,0,0.15)',
  shadowColorHover: 'rgba(0,0,0,0.2)',
}

const allThemes = { dark, light }

type ThemeName = keyof typeof allThemes
type Themes = { [key in ThemeName]: BaseTheme }

export const themes: Themes = allThemes
