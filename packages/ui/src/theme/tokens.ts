import { createTokens } from '@hanzogui/core'
import { borderRadii } from './borderRadii'
import { colors } from './colors'
import { allFonts } from './fonts'
import { gap, padding, spacing } from './spacing'
import { zIndexes } from './zIndexes'

const space = { ...spacing, ...padding, ...gap, true: spacing.spacing8 }
const size = space
const radius = { ...borderRadii, true: borderRadii.none }
const zIndex = { ...zIndexes, true: zIndexes.default }

export const tokens = createTokens({
  color: colors,
  space,
  size,
  radius,
  zIndex,
})
