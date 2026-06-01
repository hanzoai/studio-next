import { createAnimations } from '@hanzogui/animations-react-native'

export const animations = createAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
  slow: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 100,
  },
  tooltip: {
    type: 'spring',
    damping: 22,
    mass: 0.8,
    stiffness: 300,
  },
})
