import { createFont } from '@hanzogui/core'

const interFont = createFont({
  family: 'Inter, system-ui, -apple-system, sans-serif',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 30,
    10: 36,
    11: 48,
    12: 60,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 20,
    4: 22,
    5: 24,
    6: 26,
    7: 28,
    8: 32,
    9: 38,
    10: 44,
    11: 56,
    12: 68,
  },
  weight: {
    1: '400',
    2: '400',
    3: '400',
    4: '500',
    5: '500',
    6: '600',
    7: '700',
    8: '700',
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: -0.01,
    4: -0.01,
    5: -0.02,
    6: -0.02,
    7: -0.03,
    8: -0.03,
  },
})

const monoFont = createFont({
  family: 'JetBrains Mono, Fira Code, monospace',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
  },
  lineHeight: {
    1: 18,
    2: 20,
    3: 22,
    4: 24,
    5: 28,
  },
  weight: {
    1: '400',
    2: '400',
    3: '500',
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
  },
})

export const allFonts = {
  heading: interFont,
  body: interFont,
  mono: monoFont,
}
